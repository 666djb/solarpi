import ModbusRTU from "modbus-serial";
import { GrowattSPH3000 } from "./growattSPH3000.js";
export class GrowattClient {
    constructor({ device = '/dev/ttyUSB0', modbusId = 1, baudRate = 9600 } = {}) {
        this.device = device;
        this.modbusId = modbusId;
        this.baudRate = baudRate;
        this.client = new ModbusRTU();
        this.inverter = new GrowattSPH3000();
    }
    async init() {
        if (this.client.isOpen) {
            throw "Growatt connection already open";
        }
        await this.client.connectRTUBuffered(this.device, {
            baudRate: this.baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
        this.client.setID(this.modbusId);
        this.client.setTimeout(5000);
    }
    getEntities() {
        return this.inverter.entities;
    }
    async getData() {
        // Remember can only read a max of 125 words in one go
        // const inputRegisters1 = await this.client.readInputRegisters(0, 125)
        // const inputRegisters2 = await this.client.readInputRegisters(1000, 64)
        const inputRegisters1 = await this.client.readInputRegisters(this.inverter.inputRegister1Start, this.inverter.inputRegister1Count);
        const inputRegisters2 = await this.client.readInputRegisters(this.inverter.inputRegister2Start, this.inverter.inputRegister2Count);
        return { ...this.inverter.parseInputRegisters1(inputRegisters1), ...this.inverter.parseInputRegisters2(inputRegisters2) };
    }
}
