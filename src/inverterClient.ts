import ModbusRTU from "modbus-serial"
import { Inverter, SensorEntities, ControlEntities, CommandEntities } from "./inverter.js"

export class InverterClient {
    device: string
    modbusId: number
    baudRate: number
    modbusClient: ModbusRTU
    inverter: Inverter

    constructor({ device = "/dev/ttyUSB0", modbusId = 1, baudRate = 9600 } = {}, inverter: Inverter) {
        this.device = device
        this.modbusId = modbusId
        this.baudRate = baudRate
        this.modbusClient = new ModbusRTU()
        this.inverter = inverter
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
        this.modbusClient.setTimeout(50000)
    }

    public getSensorEntities(): SensorEntities {
        return this.inverter.getSensorEntities()
    }

    public getCommandEntities(): CommandEntities {
        return this.inverter.getCommandEntities()
    }

    public getControlEntities(): ControlEntities {
        return this.inverter.getControlEntities()
    }

    public async getData(): Promise<{}> {
        // Pass initialised instance of ModbusRTU class so inverter class can use e.g. readInputRegisters method
        // as many times as needed depending on the inverter type. 
        return await this.inverter.getSensorData(this.modbusClient)
    }

    public async sendCommand(command: string): Promise<{}> {
        // Pass initialised instance of ModbusRTU class so inverter class can use e.g. writeRegisters method
        // as many times as needed depending on the inverter type and the command.
        return await this.inverter.sendCommand(this.modbusClient, command)
    }

    public updateControl(controlMessage: string): {} {
        return this.inverter.updateControl(controlMessage)
    }

    public async getControlValues(): Promise <{}> {
        return this.inverter.getControlValues(this.modbusClient)
    }
}
