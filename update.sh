#!/bin/sh
pwd=$(pwd)
echo "Updating solarpi installation"
sudo -u solarpi cp package-lock.json package.json /opt/solarpi
sudo -u solarpi cp -r src /opt/solarpi
echo "Stopping solarpi"
sudo systemctl stop solarpi
echo "Getting Node.JS modules and compiling solarpi"
cd /opt/solarpi
sudo -u solarpi npm install
echo "Starting solarpi"
sudo systemctl start solarpi
cd $pwd
