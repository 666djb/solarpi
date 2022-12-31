// Tested with Growatt SPH3000 - ModBus version 3.05

import { Publisher } from "./publisher.js"
import { getConfig, models } from "./config.js"
import { InverterClient } from "./inverterClient.js"
import { logDate } from "./logDate.js"
import { GrowattSPH3000 } from "./growattSPH3000.js"
import { Inverter } from "./inverter.js"

console.log(`${logDate()} Starting SolarPi`)

const CONFIG_FILE = "options.json"
const config = getConfig(CONFIG_FILE)

let inverter: Inverter

// This is where alternative inverter models can be selected based on the model entry in the config file
// To define a new model interface, create a new class that implements the Inverter abstract class and
// add a case statement here.
switch (config.inverter.model) {
    case models.SPH3000:
        inverter = new GrowattSPH3000
        break
    default:
        console.error("Unsupported inverter model in configuration:", config.inverter.model)
        process.exit()
}

const inverterClient = new InverterClient(
    {
        baudRate: 9600,
        device: '/dev/ttyUSB0',
        modbusId: 1
    },
    inverter
)

const publisher = new Publisher(config.mqtt, inverterClient.getEntities())

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
        await inverterClient.init()
        console.log(`${logDate()} Connected to inverter`)
    } catch (error) {
        console.error(`${logDate()} Error initialising connection to Growatt`, error)
    }

    setInterval(async () => {
        let data = {}
        try {
            data = await inverterClient.getData()
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
