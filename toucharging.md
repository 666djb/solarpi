# SolarPi Time Of Use Charging

Time of use charging can now be controlled via MQTT (e.g. from Home Assistant etc.).
To do this, solarpi listens on the topic /solarpi/control for JSON formatted messages.
These messages need to contain all of the keys/values as shown here:

```
{
    command: string,
    values: {
        power: number,
        stopSOC: number,
        ac: boolean,
        timePeriod1: {
            startHour: number,
            startMinute: number,
            stopHour: number,
            stopMinute: number,
            enable: boolean
        },
        timePeriod2: {
            startHour: number,
            startMinute: number,
            stopHour: number,
            stopMinute: number,
            enable: boolean
        }
        timePeriod3: {
            startHour: number,
            startMinute: number,
            stopHour: number,
            stopMinute: number,
            enable: boolean
        }
    }
}
```

command must equal touCharging


power must be between 0 and 100 (the power to charge the battery at in %)


stopSOC must be between 0 and 100 (the state of charge to stop charging at in %)


ac must be true or false (whether grid power is used to charge the battery)


startHour must be between 0 and 23 (24 hr clock)


startMinute must be between 0 and 59


stopHour must be between 0 and 23


stopMinute must be between 0 and 59


enable must be true or false (to determine whether the time periods are to be used for charging)

