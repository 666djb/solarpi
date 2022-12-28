import { IClientOptions, IClientPublishOptions } from "mqtt"
import MQTT, { AsyncMqttClient } from 'async-mqtt'
import { MqttConfig } from "./config"
import * as events from "events"
import { growattEntity } from "./growattEntities"
import { logDate } from "./logDate.js"

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
            reconnectPeriod: 30000,
            username: config.username,
            password: config.password,
            clientId: "SOLARPI"
        } as IClientOptions

        this.mqttClient = MQTT.connect(config.brokerUrl, options)

        this.mqttClient.on("connect", () => {
            this.publishOnline(entities)
            this.emit("Connect")
        })

        this.mqttClient.on("reconnect", () => {
            this.emit("Reconnect")
        })

        this.mqttClient.on("disconnect", () => {
            this.emit("Disconnect")
        })
    }

    private async publishOnline(solarpiEntities: growattEntity[]): Promise<any> {
        const availability = [
            {
                topic: `${this.config.baseTopic}/bridge/availability`
            }
        ]

        // There is one device for SOLARPI we call this solarpi,
        // all of the entities belong to this device
        let device = {
            identifiers: ["solarpi"],
            name: "SOLARPI",
            manufacturer: "SOLARPI",
            model: "SOLARPI Bridge",
            sw_version: "0.1"
        }

        try {
            // Set our bridge availability to online
            await this.publish("bridge/availability", "online", true)

            // Advertise the presence of all standard entities so they can be discovered
            for (let entity in solarpiEntities) {
                let thisEntity = {
                    availability: availability,
                    device: device,
                    state_topic: `${this.config.baseTopic}/${solarpiEntities[entity].unique_id}`,
                    json_attributes_topic: `${this.config.baseTopic}/${solarpiEntities[entity].unique_id}`,
                    value_template: '{{ value_json.status }}',
                    object_id: solarpiEntities[entity].unique_id,
                    force_update: true,
                    ...solarpiEntities[entity],
                }
                await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, false)
            }

        } catch (ex) {
            console.log(`${logDate()} publishOnline() error: ${ex}`)
        }
    }

    public async publish(subTopic: string, data: string, retain?: boolean) {
        try {
            if(!this.mqttClient.connected){
                throw "Not connected"
            }
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, data,
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publish() error ${error}`
        }
    }

    public async publishJSON(subTopic: string, data: object, retain?: boolean) {
        try {
            if(!this.mqttClient.connected){
                throw "Not connected"
            }
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, JSON.stringify(data),
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publishJSON() error ${error}`
        }
    }

    private async publishJSONdiscovery(discoveryTopic: string, data: object, retain?: boolean) {
        try {
            if(!this.mqttClient.connected){
                throw "Not connected"
            }
            await this.mqttClient.publish(`${discoveryTopic}`, JSON.stringify(data),
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publishJSONdiscovery() error ${error}`
        }
    }
}
