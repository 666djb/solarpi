import { IClientOptions, IClientPublishOptions } from "mqtt"
import MQTT, { AsyncMqttClient } from 'async-mqtt'
import { MqttConfig } from "./config"
import * as events from "events"
import { growattEntity } from "./growattEntities";

export class Publisher extends events.EventEmitter {

    mqttClient: AsyncMqttClient;

    constructor(private config: MqttConfig, private entities: growattEntity[]) {
        super()
        const options = {
            will: {
                topic: `${config.baseTopic}/bridge/availability`,
                payload: 'offline',
                retain: true,
            },
            username: config.username,
            password: config.password,
            clientId: "SOLARPI"
        } as IClientOptions

        this.mqttClient = MQTT.connect(config.brokerUrl, options)

        this.mqttClient.on("connect", () => {
            console.log(`${Date().toLocaleString()} Connected to MQTT broker`)
            this.publishOnline(entities)
            this.emit("Connect")
        })

        this.mqttClient.on("reconnect", () => {
            console.log(`${Date().toLocaleString()} Reconnecting to MQTT broker`)
        })

        this.mqttClient.on("disconnect", () => {
            console.log(`${Date().toLocaleString()} Disconnected from MQTT broker`)
            this.emit("Disconnect")
        })
    }

    private async publishOnline(solarpiEntities: growattEntity[]): Promise<any> {
        const availability = [
            {
                topic: `${this.config.baseTopic}/bridge/availability`
            }
        ]

        // There is one device for SOLARPI we call this solarpi
        // All of the entities belong to this device
        let device = {
            identifiers: ["solarpi"],
            name: "SOLARPI",
            manufacturer: "SOLARPI",
            model: "SOLARPI Bridge",
            sw_version: "0.1"
        }

        // These are the standard entities
        // Todo: simplify this a bit - there's lots of duplication
        // let solarpiEntities = [
        //     // Energy Today
        //     {
        //         availability: availability,
        //         device: device,
        //         state_topic: `${this.config.baseTopic}/solarpi_energy_today`,
        //         json_attributes_topic: `${this.config.baseTopic}/solarpi_energy_today`,
        //         name: "Energy Today",
        //         type: "sensor",
        //         unique_id: "solarpi_energy_today",
        //         value_template: '{{ value_json.status }}',
        //         icon: "mdi:lightning-bolt"
        //     },
        //     // Energy Lifetime
        //     {
        //         availability: availability,
        //         device: device,
        //         state_topic: `${this.config.baseTopic}/solarpi_energy_lifetime`,
        //         json_attributes_topic: `${this.config.baseTopic}/solarpi_energy_lifetime`,
        //         name: "Energy Lifetime",
        //         type: "sensor",
        //         unique_id: "solarpi_energy_lifetime",
        //         value_template: '{{ value_json.status }}',
        //         icon: "mdi:lightning-bolt"
        //     },
        //     // PV1 Power
        //     {
        //         availability: availability,
        //         device: device,
        //         state_topic: `${this.config.baseTopic}/solarpi_pv1_power`,
        //         json_attributes_topic: `${this.config.baseTopic}/solarpi_pv1_power`,
        //         name: "PV1 Power",
        //         type: "sensor",
        //         unique_id: "solarpi_pv1_power",
        //         value_template: '{{ value_json.status }}',
        //         icon: "mdi:lightning-bolt"
        //     },
        //     // PV2 Power
        //     {
        //         availability: availability,
        //         device: device,
        //         state_topic: `${this.config.baseTopic}/solarpi_pv2_power`,
        //         json_attributes_topic: `${this.config.baseTopic}/pv2_power`,
        //         name: "PV2 Power",
        //         type: "sensor",
        //         unique_id: "solarpi_pv2_power",
        //         value_template: '{{ value_json.status }}',
        //         icon: "mdi:lightning-bolt"
        //     }
        // ]

        try {
            // Set our bridge availability to online
            await this.publish("bridge/availability", "online", true)

            // Advertise the presence of all standard entities so they can be discovered
            for (let entity in solarpiEntities) {
                let thisEntity = {
                    availability: availability,
                    device: device,
                    state_topic: `${this.config.baseTopic}/${solarpiEntities[entity].id}`,
                    json_attributes_topic: `${this.config.baseTopic}/${solarpiEntities[entity].id}`,
                    name: solarpiEntities[entity].name,
                    type: solarpiEntities[entity].type,
                    unique_id: solarpiEntities[entity].id,
                    value_template: '{{ value_json.status }}',
                    icon: solarpiEntities[entity].icon
                }
                await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, solarpiEntities[entity], true)
            }

        } catch (ex) {
            console.log(`${Date().toLocaleString()} publishOnline() error: ${ex}`)
        }
    }

    public async publish(subTopic: string, data: string, retain?: boolean) {
        try {
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, data,
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publish() error ${error}`
        }
    }

    public async publishJSON(subTopic: string, data: object, retain?: boolean) {
        try {
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, JSON.stringify(data),
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publishJSON() error ${error}`
        }
    }

    public async publishJSONdiscovery(discoveryTopic: string, data: object, retain?: boolean) {
        try {
            await this.mqttClient.publish(`${discoveryTopic}`, JSON.stringify(data),
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publishJSONdiscovery() error ${error}`
        }
    }
}
