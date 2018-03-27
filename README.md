# power-meter
## 所需環境
* node v8.9.4
* npm v5.6.0
* mongodb v3.6.3+
* pm2 v2.10.1

## 所需材料
* raspberry pi 3
* arduino
* 電阻：10kΩ x2、100Ω x1
* 電容：10uF x1
* 比流器
* 溫溼度感測器：DHT11

## 環境建制
### mongoDB Install
[mongoDB 3.6 install](https://github.com/TitanLi/power-meter/blob/master/mongodb.md)

### use nvm install node & npm
```
$ sudo apt-get update
$ curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
$ source ~/.profile
$ nvm --version
$ nvm install v8.9.4
$ nvm alias default v8.9.4
```

### pm2 Install
```
$ npm install -g pm2
```

## 硬體電路
![硬體電路](https://github.com/TitanLi/power-meter/blob/master/picture/power-meter.png)

## 軟體安裝
### Arduino for 220V
```
./arduino/_220V/_220V.ino
```

### Raspberry pi3 serialport data to MQTT publish
```
$ cd ./raspberry
//更改設定檔
$ vim config.js
$ npm install
$ npm start
```

### Openstack service build
```
$ cd ./openstack
//更改設定檔
$ vim config.js
$ npm Install
$ npm start
```

## 成果展示
![raspberry pi3 & arduino](<img src="https://github.com/TitanLi/power-meter/blob/master/picture/IMG20180326170700.jpg" alt="Drawing" style="width:100px;"/>)
![比流器](https://github.com/TitanLi/power-meter/blob/master/picture/IMG20180326170514.jpg)
