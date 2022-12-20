import GrowattClient from 'growatt-modbus'

console.log("Starting SolarPi")

try{
runSolarPi()
} catch (error){
console.log("Error")
}

async function runSolarPi() {
    //const GrowattClient = await import("growatt-modbus")
    const growattClient = new GrowattClient({
        baudRate: 9600,
        device: '/dev/ttyAMA0',
        modbusId: 1
    })
    try {
        await growattClient.init()
        const data = await growattClient.getData()
    } catch (error) {
        console.error("Error reading data:", error.message)
	throw(error)
    }
}
