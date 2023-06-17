import ModbusRTU from "modbus-serial"
import { getConfig, models } from "./config.js"
import fs from "fs"

const CONFIG_FILE = "options.json"

runBackup()

async function runBackup() {
    const modbusClient = new ModbusRTU()
    const config = getConfig(CONFIG_FILE)

    console.log("This back up utility is for testing only")
    console.log("Connecting to inverter")

    await modbusClient.connectRTUBuffered(config.inverter.usbDevice, {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    })

    modbusClient.setID(1)
    modbusClient.setTimeout(5000)

    console.log("Reading values")

    const fromHoldingRegisters1 = await modbusClient.readHoldingRegisters(0, 250)
    const fromHoldingRegisters2 = await modbusClient.readHoldingRegisters(1000, 125)
    const fromHoldingRegisters3 = await modbusClient.readHoldingRegisters(3000, 125)
    const fromInputRegisters1 = await modbusClient.readInputRegisters(0, 250)
    const fromInputRegisters2 = await modbusClient.readInputRegisters(1000, 250)
    const fromInputRegisters3 = await modbusClient.readInputRegisters(2000, 125)
    const fromInputRegisters4 = await modbusClient.readInputRegisters(3000, 250)

    let backupText: string = ""

    console.log("Reading Holding Registers 0-249")
    backupText = backupText.concat("Growatt Registers Backup\nHolding Registers 0-249\n")

    const { data: data1 } = fromHoldingRegisters1
    for (let i in data1) {
        backupText = backupText.concat(`${i} ${data1[i]}\n`)
    }

    console.log("Reading Holding Registers 1000-1124")
    backupText = backupText.concat("Holding Registers 1000-1124\n")

    const { data: data2 } = fromHoldingRegisters2
    for (let i in data2) {
        backupText = backupText.concat(`${1000 + parseInt(i)} ${data2[i]}\n`)
    }

    console.log("Reading Holding Registers 3000-3124")
    backupText = backupText.concat("Holding Registers 3000-3124\n")

    const { data: data3 } = fromHoldingRegisters3
    for (let i in data3) {
        backupText = backupText.concat(`${3000 + parseInt(i)} ${data3[i]}\n`)
    }

    console.log("Reading Input Registers 0-249")
    backupText = backupText.concat("Input Registers 0-249\n")

    const { data: data4 } = fromInputRegisters1
    for (let i in data4) {
        backupText = backupText.concat(`${i} ${data4[i]}\n`)
    }

    console.log("Reading Input Registers 1000-1249")
    backupText = backupText.concat("Input Registers 1000-1249\n")

    const { data: data5 } = fromInputRegisters2
    for (let i in data5) {
        backupText = backupText.concat(`${1000 + parseInt(i)} ${data5[i]}\n`)
    }

    console.log("Reading Input Registers 2000-2124")
    backupText = backupText.concat("Input Registers 2000-2124\n")

    const { data: data6 } = fromInputRegisters3
    for (let i in data6) {
        backupText = backupText.concat(`${2000 + parseInt(i)} ${data6[i]}\n`)
    }

    console.log("Reading Input Registers 3000-3249")
    backupText = backupText.concat("Input Registers 3000-3249\n")

    const { data: data7 } = fromInputRegisters4
    for (let i in data7) {
        backupText = backupText.concat(`${3000 + parseInt(i)} ${data7[i]}\n`)
    }

    backupText = backupText.concat("End\n")

    console.log("Writing to growattbackup.txt")

    fs.writeFile("growattbackup.txt", backupText, (error) => {
        if (error) {
            console.log("Error writing backup:", error)
        }
    })

    console.log("Backup done")

    modbusClient.close(() => {

    })

}
