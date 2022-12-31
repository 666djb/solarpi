// Tested with Growatt SPH3000 - ModBus version 3.05

import { Publisher } from "./publisher.js"
import { getConfig } from "./config.js"
import { GrowattClient } from "./growattClient.js"
import { logDate } from "./logDate.js"

console.log(`${logDate()} Starting SolarPi`)

const CONFIG_FILE = "options.json"
const config = getConfig(CONFIG_FILE)

console.log("Inverter model:", config.inverter.model)

const growattClient = new GrowattClient({
    baudRate: 9600,
    device: '/dev/ttyUSB0',
    modbusId: 1
})

const publisher = new Publisher(config.mqtt, growattClient.getEntities())

publisher.on("Connect", () => {
    console.log(`${logDate()} Connected to MQTT broker`)
})

publisher.on("Reconnect", () => {
    console.log(`${logDate()} Reconnecting to MQTT broker`)
})

publisher.on("Disconnect", () => {
    console.log(`${logDate()} Disconnected from MQTT broker`)
})

runSolarPi()

async function runSolarPi() {
    try {
        await growattClient.init()
        console.log(`${logDate()} Connected to inverter`)
    } catch (error) {
        console.error(`${logDate()} Error initialising connection to Growatt`, error)
    }

    setInterval(async () => {
        let data={}
        try {
            data = await growattClient.getData()
        } catch (error) {
            console.error(`${logDate()} Error reading Growatt data:`, error)
        }

        try {
            console.log(`${logDate()} Publishing data`)
            await publisher.publishData(data)
        } catch (error) {
            console.error(`${logDate()} Error publishing data to MQTT:`, error)
        }

    }, config.inverter.interval * 1000)
}
