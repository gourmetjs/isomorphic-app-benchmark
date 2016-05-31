# Build Node.js from source code on EC2 (t2.micro) / Amazon Linux

```
sudo yum update
sudo yum install gcc-c++ make openssl-devel
cd ~
wget https://nodejs.org/dist/v4.4.5/node-v4.4.5.tar.gz
tar zxf node-v4.4.5.tar.gz
cd node-v4.4.5
./configure
make
sudo make install
```

# Build this app

```
sudo yum install git
cd ~
git clone https://github.com/gourmetjs/isomorphic-app-benchmark
cd isomorphic-app-benchmark
npm install
npm run release-build
```

# Start this app automatically on system reboot

Be sure to edit the content of `iso-benchmark` to configure it for your
environment.

```
cd ~/isomorphic-app-benchmark
sudo cp deploy/init.d/iso-benchmark /etc/init.d/
sudo chmod 755 /etc/init.d/iso-benchmark
sudo chkconfig --add iso-benchmark
```

`iso-benchmark` script is based on `https://github.com/chovy/node-startup`

# Start the app

```
sudo service iso-benchmark start
```
