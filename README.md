# power-meter
* node v8.9.4
* npm v5.6.0
* mongodb v3.6.3+
* pm2 v2.10.1

## mongoDB Install
[mongoDB 3.6 install](https://github.com/TitanLi/power-meter/blob/master/mongodb.md)

## use nvm install node & npm
```
$ sudo apt-get update
$ curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
$ source ~/.profile
$ nvm --version
$ nvm install v8.9.4
$ nvm alias default v8.9.4
```

## pm2 Install
```
$ npm install -g pm2
```

## 所需材料
* raspberry pi 3
* arduino
* 電阻：10kΩ x2、100Ω x1
* 電容：10uF x1
* 比流器
* 溫溼度感測器：DHT11

## Arduino for 220V
```
./arduino/_220V/_220V.ino
```

## Raspberry pi3 serialport data to MQTT publish
```
$ cd ./raspberry
//更改設定檔
$ vim config.js
$ npm install
$ npm start
```

## Openstack service build
```
$ cd ./openstack
//更改設定檔
$ vim config.js
$ npm Install
$ npm start
```
