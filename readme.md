# SolarPi

## Description
A bridge between a solar PV inverter and MQTT, written in Typescript and executed using node.js. SolarPi reads the following values from the inverter and publishes them to an MQTT broker such as Mosquitto in Home Assistant:
* Inverter Status (status, temperatur, error)
* PV Power (both strings and total)
* PV Voltage (both strings)
* PV Energy (today and total)
* Battery Charge/Discharge Power
* Battery State of Charge
* Grid Import/Export Power
* Load Power
* Grid Import/Export Energy (today and total)
* Load Energy (today and total)
* Battery Charge/Discharge Energy (today and total)

This creates and updates the following Device and Sensor Entities in Home Assistant:
![Devices and Entities](SolarPi%20Home%20Assistant.png)

From these, Lovelace Dashboards such as the following can be created:
![Dashboard](SolarPi%20Home%20Assistant%20Dashboard.png)

I have built SolarPi to interface my Growatt SPH3000 with Home Assistant without relying on the Growatt web API or interferring with the Growatt Datalogger/WiFi dongle. That is to say the Growatt web dashboard and the Growatt ShinePhone app still work (as well as they ever did). My approach uses a standard serial port interface on the inverter in accordance with the Growatt Modbus Inverter RTU Protocol document v.1.20.

**The RS485 port on the inverter must be available and not used by any other external device, i.e. there should be nothing plugged into it already!**

I am running this code on a Raspberry Pi Zero W with an RS485-USB adapter (specifically this: https://amzn.eu/d/foIEFqZ, but others should work), I have the USB adapter plugged into the Pi using a micro-USB (male) to USB A (female) OTG adapter cable.

I have designed SolarPi so that the code is extensible to integrate other Growatt inverters and potentially other brands of inverter.

## Status
I have had this running continuously for a couple of weeks now with a 60 second update of values. I plan to update the code and enable some control of the inverter via MQTT.

I will add some pictures of the hardware and connection to the inverter soon.

## Installation
These instructions should get you set up with a connection to the inverter and the code installed. When complete you need to start the code in the next section.

1. Optionally add a plug to RS485 converter (if you are using the Amazon item above, this needs an RJ45 plug adding in order to physically connect to the inverter).
    * The white and green wires (serial data lines) from the adapter need connecting to pins 4 and 5 of an RJ45 connector. These can be connected either way as the adapter will automatically detect polarity.
    * The thin wire gauge makes crimping a connector on difficult - getting a good crimp is hard, so I recommend chopping off an old ethernet patch cable and joing the two together.
2. Configure SPH3000 inverter to use the RS485 port for monitoring:
    * Press and hold the OK key on the inverter for 3 seconds and release to enter the "Basic Parameter" menu
    * Press OK to enter the "RS485 Setting" menu
    * Press OK to enter the "Port" menu
    * Use up/down arrows to select "VPP" as the "Port"
2. Install RaspberryPi OS on Raspberry Pi.
    * You may want to enable ssh access, set your username/password and setup WiFi before starting the OS.
3. Update the OS installation (sudo apt update; sudo apt upgrade).
4. Plug in the USB adapter and check that it has been recognised by running dmesg and looking for something like the following output:

```
[   33.890325] ftdi_sio 1-1:1.0: FTDI USB Serial Device converter detected
[   33.890766] usb 1-1: Detected FT232RL
[   34.332027] usb 1-1: FTDI USB Serial Device converter now attached to ttyUSB0
```

5. Install node.js (I am using version 16.16.0).
    * First get the binary package using a command line like this:
        * wget https://unofficial-builds.nodejs.org/download/release/v16.16.0/node-v16.16.0-linux-armv6l.tar.xz
    * Then unzip it:
        * tar xvfJ node-v16.16.0-linux-armv6l.tar.xz
    * Then install the files:
        * sudo cp -R node-v16.16.0-linux-armv6l/* /usr/local
    * **Be sure to use the ARMv6 version if you are using a Raspberry Pi Zero**
    * Other versions of node.js should work, but I've not tested with them.
    * This page: https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/ gives instructions for the above.

6. Download ZIP archive of this repository and unpack to a temporary folder (alternatively clone using Git).

7. **Either** run the install script **or** follow/adapt the manual steps below to install the SolarPi code.

8. Start solarpi for the first time 

### Install script
Run the install.sh script using the command line ". ./install.sh". I recommend you familiarise yourself with what the script does first (basically, it creates a solapi user, copies the contents of the folder to /opt/solarpi and installs a systemd service so that solarpi is automatically started on boot and can be controlled using systemctl).

Skip the manual steps below if you use this script.

### Manual steps
Follow or adapt these if you don't use the install script.
1. Add a new user to run solarpi:
    * sudo adduser --system --group solarpi
2. Make a folder to put the code in:
    * sudo mkdir -p /opt/solarpi
3. Copy the code and change the permissions so the new user can run it:
    * sudo cp -r . /opt/solarpi/
    * sudo chown -R solarpi:solarpi /opt/solarpi
4. Change directory to the /opt/solarpi folder and install the node.js dependencies:
    * cd /opt/solarpi
    * sudo -u solarpi npm install

If you want solarpi to run automatically at boot do the following:

5. Install the systemd service file and enable it:
    * sudo cp solarpi.service /etc/systemd/system/
    * sudo systemctl daemon-reload
    * sudo systemctl enable solarpi

### Configure SolarPi
Edit the file /opt/solarpi/options.json to provide the following:
* The hostname or IP address of your Home Assistant's MQTT broker ("brokerUrl" in the options file)
* The username and password to access your MQTT broker (these are set in Home Assistant) ("username" and "password" in the options file)
* Set the time in seconds between each poll for values from the inverter ("interval" in the options file)
* Don't change the Inverter Model from SPH3000 as no other models have been defined yet (feel free to adapt the code to support other models though!)

### Starting SolarPi
Now test solarpi installation at this point by running it:
* cd /opt/solarpi
* sudo -u solarpi npm start
* Press Control-C to exit at any time

If you've used the install script or followed the manual steps and installed the solarpi systemd service, you can either reboot or run the following to start the service after you've finished testing:
* sudo service solarpi start

Use the following to monitor the output of the service:
* journalctl -f -u solarpi

and then to stop the service (if you need to):
* sudo service solarpi stop

### Uninstall
If you have used the install script or followed the complete set of manual steps, solarpi can be removed totally by following these steps:
* sudo systemctl stop solarpi
* sudo systemctl disable solarpi
* sudo rm /etc/systemd/system/solarpi.service
* sudo rm -rf /opt/solarpi
* sudo deluser solarpi
* sudo rm -rf /home/solarpi

## Development
So far, this has only been tested by me and does what I want it to reliably.

### To do
* Validate config file
* Add robustness to install.sh script
* Add controls to enable changes to the time when the inverter charges the battery from the grid and times to prevent the battery discharging as MQTT entities.
* Local CSV logging of energy values

Feel free to use this code for your own purposes. If you test this with a Growatt SPH inverter, please let me know, also if you add support for other inverters, I will look to merging changes in. I can't promise to provide tonnes of support, but will try to help.

## Disclaimer
Whilst these instructions and code use published open interfaces and standards, you use the instructions and code at your discretion.

## License
ISC License

Copyright 2023 David Brown

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.