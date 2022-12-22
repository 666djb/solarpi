var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import GrowattClient from 'growatt-modbus'
import GrowattClient from '../dist/growattClient.js';
console.log("Starting SolarPi");
runSolarPi();
function runSolarPi() {
    return __awaiter(this, void 0, void 0, function* () {
        const growattClient = new GrowattClient({
            baudRate: 9600,
            device: '/dev/ttyUSB0',
            modbusId: 1
        });
        try {
            yield growattClient.init();
        }
        catch (error) {
            console.error("Error initialising connection:", error);
            return;
        }
        try {
            const data = yield growattClient.getData();
            console.log("Data:", data);
        }
        catch (error) {
            console.log("Error reading data:", error);
        }
    });
}
