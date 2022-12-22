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

    try {
        while (true) {
            const data = await growattClient.getData()
            console.log(`Data: ${data}`)
            console.log("Waiting 5 seconds...")
            setTimeout(function() {
              }, 5000)
        }
    } catch (error) {
        console.error("Error:", error)
        return
    }

}
