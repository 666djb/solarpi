import GrowattClient from 'growatt-modbus';
import * as events from "events";
export class Reader extends events.EventEmitter {
    constructor() {
        super();
        this.growattClient = new GrowattClient({
            baudRate: 9600,
            device: '/dev/ttyUSB0',
            modbusId: 1
        });
    }
    static async build() {
        let reader = new Reader();
        //await reader.growattClient.init()
        setInterval(() => {
            reader.emit("Event");
        }, 5000);
        return reader;
    }
}
// async function runSolarPi() {
//     try {
//         await growattClient.init()
//     } catch (error) {
//         console.error("Error initialising connection:", error)
//         return
//     }
//     try {
//         const data = await growattClient.getData()
//         console.log("Data:", data)
//     } catch (error) {
//         console.log("Error reading data:", error)
//     }
// }
