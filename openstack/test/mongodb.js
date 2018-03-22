const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

var db;

MongoClient.connect("mongodb://127.0.0.1:27017/powerMeter",function(err,pDb){
  if(err){
    return console.dir(err);
  }
  db = pDb;
});

function plusdata(){
  var collection = db.collection('datas');
  collection.insert({
      Humidity:Math.random()*100+1,
      Temperature:Math.random()*100+1,
      Currents:Math.random()*100+1,
      inserttime:new Date(),
  });
  console.log('insert ok');
};

setInterval(() => {
  plusdata();
},1000);
