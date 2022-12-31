import ModbusRTU from "modbus-serial"
import { GrowattSPH3000 } from "./growattSPH3000.js"
import { Inverter, inverterEntity } from "./inverter.js"

export class InverterClient {
    device: string
    modbusId: number
    baudRate: number
    modbusClient: ModbusRTU
    inverter: GrowattSPH3000

    constructor({ device = "/dev/ttyUSB0", modbusId = 1, baudRate = 9600} = {}, inverter: Inverter) {
        this.device = device
        this.modbusId = modbusId
        this.baudRate = baudRate
        this.modbusClient = new ModbusRTU()
        this.inverter = new GrowattSPH3000()
    }

    public async init() {
        if (this.modbusClient.isOpen) {
            throw "Inverter connection already open"
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

    public getEntities(): inverterEntity[]{
        return this.inverter.entities
    }

    public async getData(): Promise<{}> {
        // Pass initialised instance of ModbusRTU class so inverter class can use e.g. readInputRegisters method
        // as many times as needed deoending on the inverter type. 
        return await this.inverter.getData(this.modbusClient)
    }
}
