// Tested with Growatt SPH3000 and SPH6000TL3

import { Publisher } from "./publisher.js"
import { getConfig, models } from "./config.js"
import { InverterClient } from "./inverterClient.js"
import { logDate } from "./logDate.js"
import { GrowattSPH3000 } from "./growattSPH3000.js"
import { ControlData, Inverter } from "./inverter.js"

console.log(`${logDate()} Starting SolarPi`)

const CONFIG_FILE = "options.json"
const config = getConfig(CONFIG_FILE)

let inverter: Inverter

// This is where alternative inverter models could be selected based on the model entry in the config file.
// To define a new model interface, create a new class that implements the Inverter abstract class and
// add a case statement here.
switch (config.inverter.model) {
    case models.SPH3000:
    case models.SPH6000:
        inverter = new GrowattSPH3000() // 3000 and 6000 appear to use the same structures
        break
    default:
        console.error("Unsupported inverter model in configuration:", config.inverter.model)
        process.exit()
}

const inverterClient = new InverterClient(
    config.inverter.usbDevice, // The USB device path
    9600, // Baud rate
    1, // Modbus ID
    inverter // Inverter object
)

const publisher = new Publisher(config.mqtt, inverterClient.getSensorEntities(),
    inverterClient.getControlEntities(), inverterClient.getCommandEntities())

runSolarPi()

async function runSolarPi() {
    publisher
        .on("Connect", async () => {
            console.log(`${logDate()} Connected to broker`)
            try {
                console.log(`${logDate()} Getting control values from inverter`)
                const response = await inverterClient.getControlValues()
                await publisher.publishControlData(response)
            } catch (error) {
                console.log(`${logDate()} Error getting control values from inverter:`, error)
            }
        })
        .on("Reconnect", () => {
            console.log(`${logDate()} Reconnecting to broker`)
        })
        .on("Disconnect", () => {
            console.log(`${logDate()} Disconnected from broker`)
        })
        .on("command", async (commandMessage) => {
            try {
                const response = await inverterClient.sendCommand(commandMessage)
                console.log(`${logDate()} Command sent to inverter`)
                let responseToPublish = response ? [response, commandSuccess(true)] : [commandSuccess(true)]
                await publisher.publishControlData(responseToPublish)
            } catch (error) {
                let message = error instanceof Error ? error.message : "Unknown Inverter Error"
                console.log(`${logDate()} Error sending command to inverter: ${message}`)
                await publisher.publishControlData([commandSuccess(false)])
                try {
                    console.log(`${logDate()} Getting control values from inverter`)
                    const response = await inverterClient.getControlValues()
                    await publisher.publishControlData(response)
                } catch (error) {
                    console.log(`${logDate()} Error getting control values from inverter:`, error)
                }
            }
        })
        .on("control", async (subTopic, controlMessage) => {
            try {
                const response = inverterClient.updateControl(subTopic, controlMessage)
                console.log(`${logDate()} Control values stored`)
                await publisher.publishControlData(response)
            } catch (error) {
                console.log(`${logDate()} Error updating inverter control: `, error)
            }
        })
        .on("unknown", () => {
            console.log(`${logDate()} Message received on unknown topic`)
        })

    try {
        await inverterClient.init()
        console.log(`${logDate()} Connected to inverter`)
    } catch (error) {
        console.error(`${logDate()} Error initialising connection to inveter:`, error)
    }

    setInterval(async () => {
        let data = {}
        try {
            data = await inverterClient.getData()
        } catch (error) {
            console.error(`${logDate()} Error reading inverter data:`, error)
        }

        try {
            console.log(`${logDate()} Publishing data`)
            await publisher.publishSensorData(data)
        } catch (error) {
            console.error(`${logDate()} Error publishing data:`, error)
        }
    }, config.inverter.interval * 1000)
}

function commandSuccess(successful: boolean): ControlData {
    return {
        subTopic: "status",
        values: {
            error: !successful,
            message: successful ? "Command OK" : "Command not OK"
        }
    }
}