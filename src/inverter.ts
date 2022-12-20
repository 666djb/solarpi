import { ModbusRTU } from "modbus-serial/ModbusRTU";

// Abstract class prototype for inverter
// This enables other inverter types to be defined
export abstract class Inverter {
    public abstract getData(modbusClient: ModbusRTU): Promise<{}>
    public abstract entities: inverterEntity[]
}

export interface inverterEntity {
    name: string,
    type: string,
    device_class?: string,
    state_class?: string,
    unit_of_measurement?: string,
    unique_id: string,
    value_template: string,
    icon?: string
}