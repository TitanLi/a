const koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const mqtt  = require('mqtt');
const views = require('co-views');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const serve = require('koa-static');
const config = require('./config.js');
const render = require('./lib/render.js');
const mqttClient  = mqtt.connect(config.MQTT);

// define init value
var db;
var power = 0;
var powerTotal = 0;
var money = 0;
var price = 1.63;
var humi = 0;
var temp = 0;
var currents = 0;
var mqtt_data = {};
var currentAry,powerAry,temperatureAry,humidityAry,timeAry;
var collection,date,yesterday;
var nowHour,correctionToday,correctionYesterday;

app.use(logger());
app.use(serve('./'));

MongoClient.connect(config.mongodb,function(err,pDb){
  if(err){
    return console.dir(err);
  }
  db = pDb;
});

// arduino data insert
function plusdata(){
  var collection = db.collection('datas');
  if(humi && temp && currents){
     collection.insert({
      Humidity:humi,
      Temperature:temp,
      Currents:currents,
      inserttime:new Date(),
    });
  }
    console.log('insert ok');
};

mqttClient.on('connect', function () {
  console.log('on connect');
  mqttClient.subscribe('current');
});

mqttClient.on('message', function (topic, message) {
  try{
    mqtt_data = JSON.parse(message); //serial print turn to JSON -> serialPort_data
    if(typeof(mqtt_data.Humidity) == "number" && typeof(mqtt_data.Temperature) == "number" && typeof(mqtt_data.currents)=="number"){
      humi = mqtt_data.Humidity;  //get data.Humidity (json)
      temp = mqtt_data.Temperature; //get data.Temperature (json)
      currents = mqtt_data.currents; //get data.currents (json)
      plusdata(); // call mongo insert func
      powerTotal = power + currents * 220 / 3600 / 1000;
      money = powerTotal * price;
    }
  }
  catah(e){
    console.log("JSON error");
  }
});

io.sockets.on('connection', function (client) {
    mqttClient.on('message', function (topic, message) {
      if(typeof(mqtt_data.Humidity) == "number" && typeof(mqtt_data.Temperature) == "number" && typeof(mqtt_data.currents)=="number"){
        // console.log(message.toString());
         //socket.io s
          client.emit('humi', {
            data: humi
          })
          client.emit('temp', {
            data: temp
          })
          client.emit('event', {
            data: currents
          }); //發送資料
          client.emit('power', {
            data: powerTotal
          }); //發送資料
          client.emit('price', {
            data: price
          }); //發送資料
          client.emit('money', {
            data: money
          }); //發送資料
          client.on('client_data', function (data) { // 接收來自於瀏覽器的資料
            price = data.data;
          });
      }
    });
});

router.get('/', function* index() {
  var collection = db.collection('datas');
  yield function(done){
    collection.aggregate([
      {
        $group:{
          _id:new ObjectID(),
          power:{$sum:"$Currents"}
        }
      }
    ],function(err, results) {
      if(results.length>0){
        power = results[0].power*220/3600/1000;
      }
      done();
    });
  }
  console.log(power);
  this.body = yield render('home');
});

router.get('/line',function * (){
  currentAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  powerAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  temperatureAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  humidityAry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  timeAry = new Array();

  yield function(done){
      collection = db.collection('datas');
      date = new Date();
      yesterday = new Date(new Date().setDate(new Date().getDate()-1));
      console.log(date,yesterday);
      collection.aggregate(
        [ { $match : {"inserttime":{"$gte":new Date(new Date().setDate(new Date().getDate()-1)),"$lte":new Date()}}},
        { $group: {
                    _id: {
                      $hour: {
                        date: "$inserttime",
                        timezone: "Asia/Taipei"
                      }
                    },
                    currents:{$avg:"$Currents"},
                    power:{$sum:"$Currents"},
                    temperature:{$avg:"$Temperature"},
                    humidity:{$avg:"$Humidity"}
                  }
        }
     ]).toArray(function(err, results) {
       console.log(results);
       nowHour = new Date().getHours();
       correctionToday = 23 - nowHour;
       correctionYesterday = correctionToday - 1;
       for(var i=0;i<results.length;i++){
         dbHour = results[i]._id;
         if(dbHour<=nowHour){
           currentAry[dbHour+correctionToday] = results[i].currents;
           powerAry[dbHour+correctionToday] = results[i].power*220/1000/60/60;
           temperatureAry[dbHour+correctionToday] = results[i].temperature;
           humidityAry[dbHour+correctionToday] = results[i].humidity;
         }else{
           currentAry[dbHour+correctionToday] = results[i].currents;
           powerAry[dbHour+correctionToday] = results[i].power*220/1000/60/60;
           temperatureAry[dbHour+correctionToday] = results[i].temperature;
           humidityAry[dbHour+correctionToday] = results[i].humidity;
         }
       }
       for(var i=23 ; i>=0 ; i--){
               var count = new Date().getHours()+i-23;
               if(count>=0){
                 timeAry[i]=count;
               }else{
                 timeAry[i]=24+count;
               }
               done();
        }
     });
  }

  this.body = yield render('lineChart',{currentAry:currentAry,
                                        powerAry:powerAry,
                                        temperatureAry:temperatureAry,
                                        humidityAry:humidityAry,
                                        timeAry:timeAry});
});

router.get('/icinga',function * (){
    this.body = {
      "humi" : humi,
      "temp" : temp,
      "currents" : new Number(currents).toFixed(4),
      "power" : new Number(powerTotal).toFixed(4)
    }
});

app.use(router.middleware());
server.listen(3000, function () {
  console.log('listening on port 3000');
});
