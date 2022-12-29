import MQTT from 'async-mqtt';
import * as events from "events";
import { logDate } from "./logDate.js";
export class Publisher extends events.EventEmitter {
    constructor(config, entities) {
        super();
        this.config = config;
        this.entities = entities;
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
        };
        this.mqttClient = MQTT.connect(config.brokerUrl, options);
        this.mqttClient.on("connect", () => {
            this.publishOnline(entities);
            this.emit("Connect");
        });
        this.mqttClient.on("reconnect", () => {
            this.emit("Reconnect");
        });
        this.mqttClient.on("disconnect", () => {
            this.emit("Disconnect");
        });
    }
    async publishOnline(solarpiEntities) {
        const availability = [
            {
                topic: `${this.config.baseTopic}/bridge/availability`
            }
        ];
        // There is one device for SOLARPI we call this solarpi,
        // all of the entities belong to this device
        let device = {
            identifiers: ["solarpi"],
            name: "SOLARPI",
            manufacturer: "SOLARPI",
            model: "SOLARPI Bridge",
            sw_version: "0.1"
        };
        try {
            // Set our bridge availability to online
            await this.publish("bridge/availability", "online", true);
            // Advertise the presence of all standard entities so they can be discovered
            for (let entity in solarpiEntities) {
                let thisEntity = {
                    availability: availability,
                    device: device,
                    state_topic: `${this.config.baseTopic}/inverter`,
                    json_attributes_topic: `${this.config.baseTopic}/inverter`,
                    object_id: solarpiEntities[entity].unique_id,
                    force_update: true,
                    ...solarpiEntities[entity],
                };
                await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, true);
            }
        }
        catch (ex) {
            console.log(`${logDate()} publishOnline() error: ${ex}`);
        }
    }
    async publish(subTopic, data, retain) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected";
            }
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, data, { retain: retain || false });
        }
        catch (error) {
            throw `publish() error ${error}`;
        }
    }
    async publishData(data, retain) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected";
            }
            await this.mqttClient.publish(`${this.config.baseTopic}/inverter`, JSON.stringify(data), { retain: retain || false });
        }
        catch (error) {
            throw `publishJSON() error ${error}`;
        }
    }
    async publishJSONdiscovery(discoveryTopic, data, retain) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected";
            }
            await this.mqttClient.publish(`${discoveryTopic}`, JSON.stringify(data), { retain: retain || false });
        }
        catch (error) {
            throw `publishJSONdiscovery() error ${error}`;
        }
    }
}
