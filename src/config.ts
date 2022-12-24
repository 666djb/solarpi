import fs from 'fs'

export interface Config {
    mqtt: MqttConfig,
    growatt: GrowattConfig
}

export interface MqttConfig {
    brokerUrl: string
    baseTopic: string
    username: string
    password: string
    discoveryTopic: string
}

export interface GrowattConfig {
    interval: number
}

// Todo: check sanity of config items
export function getConfig(configFile: string): Config {
    return JSON.parse(fs.readFileSync(configFile, "utf8")) as Config
}
