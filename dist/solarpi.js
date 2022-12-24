import { Publisher } from "./publisher.js";
import { getConfig } from "./config.js";
import GrowattClient from 'growatt-modbus';
console.log(`${Date().toLocaleString()} Starting SolarPi`);
const CONFIG_FILE = "options.json";
const config = getConfig(CONFIG_FILE);
const publisher = new Publisher(config.mqtt);
const growattClient = new GrowattClient({
    baudRate: 9600,
    device: '/dev/ttyUSB0',
    modbusId: 1
});
publisher.on("Connect", () => {
    runSolarPi();
});
publisher.on("Disconnect", () => {
    // Todo do something here
});
function runSolarPi() {
    let a = 0;
    try {
        //await reader.growattClient.init()
    }
    catch (error) {
        console.error("Error initialising connection to Growatt", error);
    }
    setInterval(async () => {
        try {
            // Here get the growattt data and pass to a new method in publisher that will parse it and then publish it
            // Handle errors in getting data, publishing data
        }
        catch (error) {
            console.error("Error reading Growatt data:", error);
        }
        try {
            await publisher.publishJSON("solarpi_energy_today", { status: `${a++}` });
        }
        catch (error) {
            console.error("Error publishing data to MQTT:", error);
        }
    }, config.growatt.interval * 1000);
}
