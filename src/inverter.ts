import { ModbusRTU } from "modbus-serial/ModbusRTU";

// Abstract class prototype for inverter
// This enables other inverter types to be defined
export abstract class Inverter {
    public abstract getSensorEntities(): SensorEntities
    public abstract getCommandEntities(): CommandEntities
    public abstract getControlEntities(): ControlEntities
    public abstract getSensorData(modbusClient: ModbusRTU): Promise<{}>
    public abstract sendCommand(modbusClient: ModbusRTU, command: string): Promise<{}>
    public abstract updateControl(controlMessage: string): {}
    public abstract getControlValues(modbusClient: ModbusRTU): {}
}

export interface Command {
    command: string
}

export interface SensorEntity {
    name: string,
    type: string,
    device_class?: string,
    state_class?: string,
    unit_of_measurement?: string,
    unique_id: string,
    value_template: string,
    icon?: string
}

export interface CommandEntity {
    name: string,
    type: string,
    unique_id: string,
    command_template: string,
    payload_press: string,
    icon: string
}

export interface ControlEntity {
    name: string,
    type: string,
    device_class?: string,
    state_class?: string,
    unit_of_measurement?: string,
    unique_id: string,
    value_template?: string,
    command_template?: string,
    payload_press?: string,
    payload_off?: string,
    payload_on?: string,
    state_on?: string,
    state_off?: string,
    mode?: string,
    min?: number,
    max?: number,
    icon?: string
}

export interface SensorEntities {
    subTopic: string,
    entities: SensorEntity[]
}

export interface CommandEntities {
    subTopic: string,
    entities: CommandEntity[]
}

export interface ControlEntities {
    subTopic: string,
    entities: ControlEntity[]
}