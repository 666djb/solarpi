#!/bin/sh
echo "Adding solarpi system user"
sudo adduser --system --no-create-home --group solarpi
echo "Creating /opt/solarpi directory"
sudo mkdir -p /opt/solarpi
echo "Copying files"
sudo cp -r . /opt/solarpi/
sudo chown -r solarpi:solarpi /opt/solarpi
echo "Getting Node.JS modules and compiling solarpi"
cd /opt/solarpi
sudo su solarpi npm install
echo "Creating systemd service for solarpi"
cp solarpi.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable solarpi
echo "Starting solarpi service"
#service myapp start