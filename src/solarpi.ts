//import GrowattClient from 'growatt-modbus'
import GrowattClient from '../dist/growattClient.js'

console.log("Starting SolarPi")

runSolarPi()

async function runSolarPi() {
    const growattClient = new GrowattClient({
        baudRate: 9600,
        device: '/dev/ttyUSB0',
        modbusId: 1
    })

    try {
        await growattClient.init()
    } catch (error) {
        console.error("Error initialising connection:", error)
        return
    }

    try {
        const data = await growattClient.getData()
        console.log("Data:", data)
    } catch (error) {
        console.log("Error reading data:", error)
    }

}
