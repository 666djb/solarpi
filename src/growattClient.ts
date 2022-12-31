import ModbusRTU from "modbus-serial"
import { GrowattSPH3000 } from "./growattSPH3000.js"
import { growattEntity } from "./growattEntity.js"

export class GrowattClient {
    device: string
    modbusId: number
    baudRate: number
    modbusClient: ModbusRTU
    inverter: GrowattSPH3000

    constructor({ device = '/dev/ttyUSB0', modbusId = 1, baudRate = 9600 } = {}) {
        this.device = device
        this.modbusId = modbusId
        this.baudRate = baudRate
        this.modbusClient = new ModbusRTU()
        this.inverter = new GrowattSPH3000()
    }

    public async init() {
        if (this.modbusClient.isOpen) {
            throw "Growatt connection already open"
        }

        await this.modbusClient.connectRTUBuffered(this.device, {
            baudRate: this.baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        })

        this.modbusClient.setID(this.modbusId)
        this.modbusClient.setTimeout(5000)
    }

    public getEntities(): growattEntity[]{
        return this.inverter.entities
    }

    public async getData(): Promise<{}> {
        // Pass initialised instance of ModbusRTU class so inverter class can use e.g. readInputRegisters method
        // as many times as needed deoending on the inverter type. 
        return await this.inverter.getData(this.modbusClient)

        // Remember can only read a max of 125 words in one go

        //const inputRegisters1 = await this.client.readInputRegisters(this.inverter.inputRegister1Start, this.inverter.inputRegister1Count)
        //const inputRegisters2 = await this.client.readInputRegisters(this.inverter.inputRegister2Start, this.inverter.inputRegister2Count)

        //return { ...this.inverter.parseInputRegisters1(inputRegisters1), ...this.inverter.parseInputRegisters2(inputRegisters2) }
    }
}
