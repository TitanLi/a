# MongoDB
* 環境ubuntu 16.04

## install

1. Import the public key used by the package management system.
```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
```
2. Create a list file for MongoDB
```
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
```
3. Reload local package database.
```
$ sudo apt-get update
```
4. Install the MongoDB packages.
```
$ sudo apt-get install -y mongodb-org
```
5. Start MongoDB.
```
$ sudo service mongod start
```

6. mongo start error.
```
$ sudo vim /lib/systemd/system/mongodb.service
insert:
[Unit]
Description=MongoDB Database Service
Wants=network.target
After=network.target

[Service]
ExecStart=/usr/bin/mongod --config /etc/mongod.conf
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
User=mongodb
Group=mongodb
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

## uninstall
1. Stop MongoDB.
```
$ sudo service mongod stop
```
2. Remove Packages.
```
$ sudo apt-get purge mongodb-org*
```
3. Remove Data Directories.
```
$ sudo rm -r /var/log/mongodb
$ sudo rm -r /var/lib/mongodb
```
