#!/bin/bash
pwd=$(pwd)
echo "Note updating to version 1.0.4 from an earlier version requires an additional line in the configuration file options.json to be added for the USB device path"

if test -f "/opt/solarpi/version"; then
    echo -n "Updating solarpi installation from Version "
    cat /opt/solarpi/version
    echo -n " to Version "
    cat version
    echo
else
    echo -n "Updating solarpi installation to Version "
    cat version
    echo
fi

echo "Do you want to keep using existing configuration file?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) echo "Keeping current config"; sudo -u solarpi cp options.json /opt/solarpi/options.json.example; break;;
        No ) echo "Backing up current config to options.json.backup"; sudo -u solarpi cp /opt/solarpi/options.json /opt/solarpi/options.json.backup; sudo -u solarpi cp options.json /opt/solarpi; break;;
    esac
done
sudo -u solarpi cp package-lock.json package.json version /opt/solarpi
sudo -u solarpi cp -r src /opt/solarpi
echo "Stopping solarpi"
sudo systemctl stop solarpi
echo "Getting Node.js modules and compiling solarpi"
cd /opt/solarpi
sudo -u solarpi npm install
echo "Starting solarpi"
sudo systemctl start solarpi
cd $pwd
