import ModbusRTU from "modbus-serial"
import fs from "fs"

runBackup()

async function runBackup() {
    let modbusClient = new ModbusRTU()

    console.log("Connecting to inverter")

    await modbusClient.connectRTUBuffered("/dev/ttyUSB0", {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    })

    modbusClient.setID(1)
    modbusClient.setTimeout(5000)

    console.log("Reading values")

    const fromHoldingRegisters1 = await modbusClient.readHoldingRegisters(0, 125)
    const fromHoldingRegisters2 = await modbusClient.readHoldingRegisters(1000, 125)
    const fromInputRegisters1 = await modbusClient.readInputRegisters(0, 125)
    const fromInputRegisters2 = await modbusClient.readInputRegisters(1000, 125)

    let backupText: string = ""

    backupText = backupText.concat("Growatt Registers Backup\nHolding Registers 0-124\n")

    const { data: data1 } = fromHoldingRegisters1
    for (let i in data1) {
        backupText = backupText.concat(`${i} ${data1[i]}\n`)
    }

    backupText = backupText.concat("Holding Registers 1000-1124\n")

    const { data: data2 } = fromHoldingRegisters2
    for (let i in data2) {
        backupText = backupText.concat(`${1000 + parseInt(i)} ${data2[i]}\n`)
    }

    backupText = backupText.concat("Input Registers 0-124\n")

    const { data: data3 } = fromInputRegisters1
    for (let i in data3) {
        backupText = backupText.concat(`${i} ${data3[i]}\n`)
    }

    backupText = backupText.concat("Input Registers 1000-1124\n")

    const { data: data4 } = fromInputRegisters2
    for (let i in data4) {
        backupText = backupText.concat(`${1000 + parseInt(i)} ${data3[i]}\n`)
    }

    backupText = backupText.concat("End\n")

    console.log("Writing to growattbackup.txt")

    fs.writeFile("growattbackup.txt", backupText, (error) => {
        if (error) {
            console.log("Error writing backup:", error)
        }
    })

    console.log("Backup done")

    modbusClient.close
}
