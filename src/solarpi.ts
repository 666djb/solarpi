import GrowattClient from 'growatt-modbus'

console.log("Starting SolarPi")

runSolarPi()

async function runSolarPi() {
    const growattClient = new GrowattClient({
        baudRate: 9600,
        device: '/dev/ttyAMA0',
        modbusId: 1
    })

    try {
        await growattClient.init()
        const data = await growattClient.getData()
        console.log(`Data: ${data}`)
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error reading data: ${error.message}`)
        } else {
            console.error("Unknown error:", error)
        }
    }
    console.log("Ending")
}
