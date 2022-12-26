import { Publisher } from "./publisher.js";
import { getConfig } from "./config.js";
import { getEntities, getEntityfromMap } from "./growattEntities.js";
import GrowattClient from 'growatt-modbus';
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
    runSolarPi();
});
publisher.on("Disconnect", () => {
    // Todo do something here
});
async function runSolarPi() {
    let a = 0;
    try {
        await growattClient.init();
    }
    catch (error) {
        console.error(`${Date().toLocaleString()} Error initialising connection to Growatt`, error);
    }
    setInterval(async () => {
        let data = {};
        try {
            data = await growattClient.getData();
            // data = {
            //     status: "Normal",
            //     inputPower: 200,
            //     pv1Voltage: 201,
            //     pv1Current: 100,
            //     pv1InputPower: 101,
            //     pv2Voltage: 202,
            //     pv2Current: 102,
            //     pv2InputPower: 103,
            //     outputPower: 500,
            //     gridFrequency: 50,
            //     gridVoltage: 240,
            //     gridOutputCurrent: 5,
            //     gridOutputPower: 600,
            //     todayEnergy: 1000,
            //     totalEnergy: 10000,
            //     totalWorkTime: 1000,
            //     pv1TodayEnergy: 500,
            //     pv1TotalEnergy: 5000,
            //     pv2TodayEnergy: 500,
            //     pv2TotalEnergy: 5000,
            //     pvEnergyTotal: 10000,
            //     inverterTemperature: 36,
            //     ipmTemperature: 37,
            //     inverterOutputPf: 100,
            //     error: 0,
            //     realPowerPercent: 100
            // }
        }
        catch (error) {
            console.error(`${Date().toLocaleString()} Error reading Growatt data:`, error);
        }
        try {
            // Map GrowattClient key names to our entities and publish values
            for (const [key, value] of Object.entries(data)) {
                let entity = getEntityfromMap(key);
                if (entity) {
                    console.log(`Publishing: ${entity}:${value}`);
                    await publisher.publishJSON(entity, { status: value });
                }
            }
        }
        catch (error) {
            console.error(`${Date().toLocaleString()} Error publishing data to MQTT:`, error);
        }
    }, config.growatt.interval * 1000);
}
