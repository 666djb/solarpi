import fs from 'fs'

export interface Config {
    mqtt: MqttConfig,
    inverter: InverterConfig
}

export interface MqttConfig {
    brokerUrl: string,
    baseTopic: string,
    username: string,
    password: string,
    discoveryTopic: string
}

export enum models{
    SPH3000 = "SPH3000",
    Other = "Other"
}

export interface InverterConfig {
    model: models,
    interval: number
}

// Todo: check sanity of config items, parse with ajv?
export function getConfig(configFile: string): Config {
    return JSON.parse(fs.readFileSync(configFile, "utf8")) as Config
}
