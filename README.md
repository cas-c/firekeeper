#### Installing Redis
```sh
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```

#### tcl8.5 is required
```sh
sudo apt-get install -y tcl
```

#### WSL/BoUoW hack
```sh
sudo sed -i -e 's/127.0.0.1/0.0.0.0/g' /etc/redis/redis.conf
sudo service redis-server restart
```

#### run worker
```
npm run worker
```