import ModbusRTU from "modbus-serial";
export class GrowattClient {
    constructor({ device = '/dev/ttyUSB0', modbusId = 1, baudRate = 9600 } = {}) {
        this.device = device;
        this.modbusId = modbusId;
        this.baudRate = baudRate;
        this.client = new ModbusRTU();
    }
    async init() {
        await this.client.connectRTUBuffered(this.device, {
            baudRate: this.baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
        this.client.setID(this.modbusId);
        this.client.setTimeout(5000);
    }
    async getData() {
        const inputRegisters = await this.client.readInputRegisters(0, 125);
        //const holdingRegisters = await this.client.readHoldingRegisters(23, 5)
        //const allHoldingRegisters = await this.client.readHoldingRegisters(0,51);
        //parseAllHoldingRegisters(allHoldingRegisters);
        return { ...GrowattClient.parseInputRegisters(inputRegisters) }; //, ...GrowattClient.parseHoldingRegisters(holdingRegisters)};
    }
    // static parseAllHoldingRegisters(allHoldingRegisters){
    //     console.log("AllHolding:", allHoldingRegisters)
    //     let serialNumber = allHoldingRegisters.slice(23,28).toString()
    //     console.log("This serial number:", serialNumber)
    //     let dateTime = allHoldingRegisters.slice(45,50).toString()
    //     console.log("This datatime:", dateTime)
    // }
    // static parseHoldingRegisters(holdingRegisters) {
    //     return {
    //         serialNumber: holdingRegisters.buffer.toString()
    //     }
    // }
    static parseInputRegisters(inputRegisters) {
        for (let item in inputRegisters) {
            console.log(`Item: ${item} Value: ${inputRegisters[item]}`);
        }
        const statusMap = {
            0: 'Waiting',
            1: 'Normal',
            3: 'Fault'
        };
        const errorMap = {
            201: 'Leakage current too high',
            202: 'The DC input voltage is exceeding the maximum tolerable value.',
            203: 'Insulation problem',
            300: 'Utility grid voltage is out of permissible range.',
            302: 'No AC connection',
            303: 'Utility grid frequency out of permissible range.',
            304: 'Voltage of Neutral and PE above 30V.',
            407: 'Auto test didn’t pass.'
        };
        const { data } = inputRegisters;
        return {
            status: statusMap[data[0]] || data[0],
            inputPower: (data[1] << 16 | data[2]) / 10.0,
            pv1Voltage: data[3] / 10.0,
            pv1Current: data[4] / 10.0,
            pv1InputPower: (data[5] << 16 | data[6]) / 10.0,
            pv2Voltage: data[7] / 10.0,
            pv2Current: data[8] / 10.0,
            pv2InputPower: (data[9] << 16 | data[10]) / 10.0,
            outputPower: (data[35] << 16 | data[36]) / 10,
            gridFrequency: data[37] / 100.0,
            gridVoltage: data[38] / 10.0,
            gridOutputCurrent: data[39] / 10.0,
            gridOutputPower: (data[40] << 16 | data[41]) / 10.0,
            todayEnergy: (data[53] << 16 | data[54]) / 10.0,
            totalEnergy: (data[55] << 16 | data[56]) / 10.0,
            totalWorkTime: (data[57] << 16 | data[58]) / 2,
            pv1TodayEnergy: (data[59] << 16 | data[60]) / 10.0,
            pv1TotalEnergy: (data[61] << 16 | data[62]) / 10.0,
            pv2TodayEnergy: (data[63] << 16 | data[64]) / 10.0,
            pv2TotalEnergy: (data[65] << 16 | data[66]) / 10.0,
            pvEnergyTotal: (data[91] << 16 | data[92]) / 10.0,
            inverterTemperature: data[93] / 10.0,
            ipmTemperature: data[94] / 10.0,
            inverterOutputPf: data[100],
            error: errorMap[data[105]] || data[105],
            realPowerPercent: data[113] //% 0-100
        };
    }
}
//export default GrowattClient;
