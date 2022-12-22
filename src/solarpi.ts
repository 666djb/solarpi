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
    } catch (error) {
        console.error("Error initialising connection:", error)
        return
    }

    setInterval(async function () {
        console.log("Waiting 5 seconds...")
        try {
            const data = await growattClient.getData()
            console.log("Data:", data)
        } catch (error) {
            console.log("Error reading data:", error)
        }

    }, 5000)

}
