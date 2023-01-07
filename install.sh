#!/bin/sh
pwd=$(pwd)
echo "Adding solarpi system user"
sudo adduser --system --group solarpi
echo "Adding solarpi user to group dialout"
sudo usermod -a -G dialout solarpi
echo "Creating /opt/solarpi directory"
sudo mkdir -p /opt/solarpi
echo "Copying files"
sudo cp -r . /opt/solarpi/
sudo chown -R solarpi:solarpi /opt/solarpi
echo "Getting Node.JS modules and compiling solarpi"
cd /opt/solarpi
sudo -u solarpi npm install
echo "Creating systemd service for solarpi"
sudo cp solarpi.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable solarpi
cd $pwd
