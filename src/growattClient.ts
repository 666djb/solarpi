import ModbusRTU from "modbus-serial"
import { ReadRegisterResult } from "modbus-serial/ModbusRTU"

export class GrowattClient {
    device: string
    modbusId: number
    baudRate: number
    client: ModbusRTU

    constructor({device = '/dev/ttyUSB0', modbusId = 1, baudRate = 9600} = {}) {
        this.device = device
        this.modbusId = modbusId
        this.baudRate = baudRate
        this.client = new ModbusRTU()
    }

    async init() {
        await this.client.connectRTUBuffered(this.device, {
            baudRate: this.baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
        this.client.setID(this.modbusId)
        this.client.setTimeout(5000)
    }

    async getData() {
        // Can only read a max of 125 words in one go

        const inputRegisters1 = await this.client.readInputRegisters(0, 125)
        const inputRegisters2 = await this.client.readInputRegisters(1014, 1)

        //const holdingRegisters = await this.client.readHoldingRegisters(23, 5)

        return {...this.parseInputRegisters(inputRegisters1), ...this.parseSOC(inputRegisters2)} //, ...GrowattClient.parseHoldingRegisters(holdingRegisters)};
    }

    

    // static parseHoldingRegisters(holdingRegisters) {
    //     return {
    //         serialNumber: holdingRegisters.buffer.toString()
    //     }
    // }

    private parseInputRegisters(inputRegisters: ReadRegisterResult) {
        const {data} = inputRegisters

        console.log("data length:", data.length)
        for( let item in data){
            console.log(`Item: ${item} Value: ${data[item]}`)
        }
        const statusMap = {
            0: 'Waiting',
            1: 'Normal',
            3: 'Fault'
        }
        const errorMap = {
            201: 'Leakage current too high',
            202: 'The DC input voltage is exceeding the maximum tolerable value.',
            203: 'Insulation problem',
            300: 'Utility grid voltage is out of permissible range.',
            302: 'No AC connection',
            303: 'Utility grid frequency out of permissible range.',
            304: 'Voltage of Neutral and PE above 30V.',
            407: 'Auto test didn’t pass.'
        }

        let retVal = {
            inverterStatus: statusMap[data[0]] || data[0],
            ppv: (data[1] << 16 | data[2]) / 10.0, //W
            vpv1: data[3] / 10.0, //V
            pv1Curr: data[4] / 10.0, //A
            ppv1: (data[5] << 16 | data[6]) / 10.0, //W
            vpv2: data[7] / 10.0, //V
            pv2Curr: data[8] / 10.0, //A
            ppv2: (data[9] << 16 | data[10]) / 10.0, //W
            pac: (data[35] << 16 | data[36]) / 10, // W
            fac: data[37] / 100.0, // Hz
            vac: data[38] / 10.0, //V
            iac: data[39] / 10.0, //A
            pac1: (data[40] << 16 | data[41]) / 10.0, //VA
            eacToday: (data[53] << 16 | data[54]) / 10.0, //kWh
            eacTotal: (data[55] << 16 | data[56]) / 10.0, //kWh
            //totalWorkTime: (data[57] << 16 | data[58]) / 2, //s
            //pv1TodayEnergy: (data[59] << 16 | data[60]) / 10.0, //kWh
            //pv1TotalEnergy: (data[61] << 16 | data[62]) / 10.0, //kWh
            //pv2TodayEnergy: (data[63] << 16 | data[64]) / 10.0, //kWh
            //pv2TotalEnergy: (data[65] << 16 | data[66]) / 10.0, //kWh
            //epvTotal: (data[91] << 16 | data[92]) / 10.0, //kWh
            inverterTemperature: data[93] / 10.0, //°C
            //ipmTemperature: data[94] / 10.0, //°C
            //inverterOutputPf: data[100], //powerfactor 0-20000
            error: errorMap[data[105]] || data[105]
            //realPowerPercent: data[113] //% 0-100
        }

        console.log("retVal:", retVal)

        return retVal
    }

    private parseSOC(socRegisters: ReadRegisterResult) {
        const {data} = socRegisters
        return { soc: data[0] }
    }

}
