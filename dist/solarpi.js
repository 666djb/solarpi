import { Publisher } from "./publisher.js";
import { getConfig } from "./config.js";
import { getEntities, getEntityfromMap } from "./growattEntities.js";
import { GrowattClient } from "./growattClient.js";
import { logDate } from "./logDate.js";
console.log(`${Date().toLocaleString()} Starting SolarPi`);
const CONFIG_FILE = "options.json";
const config = getConfig(CONFIG_FILE);
const publisher = new Publisher(config.mqtt, getEntities());
const growattClient = new GrowattClient({
    baudRate: 9600,
    device: '/dev/ttyUSB0',
    modbusId: 1
});
publisher.on("Connect", () => {
    console.log(`${logDate()} Connected to MQTT broker`);
});
publisher.on("Reconnect", () => {
    console.log(`${logDate()} Reconnecting to MQTT broker`);
});
publisher.on("Disconnect", () => {
    console.log(`${logDate()} Disconnected from MQTT broker`);
});
runSolarPi();
async function runSolarPi() {
    try {
        await growattClient.init();
        console.log(`${logDate()} Connected to inverter`);
    }
    catch (error) {
        console.error(`${logDate()} Error initialising connection to Growatt`, error);
    }
    setInterval(async () => {
        let data = {};
        try {
            data = await growattClient.getData();
        }
        catch (error) {
            console.error(`${logDate()} Error reading Growatt data:`, error);
        }
        try {
            // Map GrowattClient key names to our entities and publish values
            console.log(`${logDate()} Publishing data`);
            for (const [key, value] of Object.entries(data)) {
                let entity = getEntityfromMap(key);
                if (entity) {
                    //console.log(`Publishing: ${entity}:${value}`)
                    await publisher.publishJSON(entity, { status: value });
                }
            }
        }
        catch (error) {
            console.error(`${logDate()} Error publishing data to MQTT:`, error);
        }
    }, config.growatt.interval * 1000);
}
