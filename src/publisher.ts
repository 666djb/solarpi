import { IClientOptions, IClientPublishOptions } from "mqtt"
import MQTT, { AsyncMqttClient } from 'async-mqtt'
import { MqttConfig } from "./config.js"
import * as events from "events"
import { logDate } from "./logDate.js"
import { SensorEntities, ControlEntities, CommandEntities, ControlData } from "./inverter.js"

export class Publisher extends events.EventEmitter {
    mqttClient: AsyncMqttClient
    sensorEntities: SensorEntities
    controlEntities: ControlEntities[]

    constructor(private config: MqttConfig, sensorEntities: SensorEntities, controlEntities: ControlEntities[],
        commandEntities: CommandEntities) {

        super()

        this.sensorEntities = sensorEntities
        this.controlEntities = controlEntities

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
            // Publish all the entities for sensor values, controls values and commands
            this.publishOnline(sensorEntities, controlEntities, commandEntities)

            // Subscribe to commands sent to us e.g. Get TOU Charge button
            // via basetopic/command/set
            // Commands cause us to do something
            this.subscribe(`${config.baseTopic}/${commandEntities.subTopic}/set`)

            // Subscribe to control values sent to us e.g. touCharging and touDischarging values
            // via basetopic/touCharging/set and basetopic/touDischarging/set
            // Control values get held by us (and sent to the inverter if a command is received)
            for (let controlEntityIndex in controlEntities) {
                this.subscribe(`${config.baseTopic}/${controlEntities[controlEntityIndex].subTopic}/set`)
            }

            this.emit("Connect")
        })

        this.mqttClient.on("reconnect", () => {
            this.emit("Reconnect")
        })

        this.mqttClient.on("disconnect", () => {
            this.emit("Disconnect")
        })

        this.mqttClient.on("message", (topic, message) => {
            if (topic == `${config.baseTopic}/${commandEntities.subTopic}/set`) {
                this.emit("command", message.toString())
            } else if (topic.startsWith(`${config.baseTopic}/`)) {
                //TODO could simplify this and not need the check on the line above
                for (let controlEntityIndex in controlEntities) {
                    if (topic.substring(config.baseTopic.length + 1) == `${controlEntities[controlEntityIndex].subTopic}/set`) {
                        this.emit("control", controlEntities[controlEntityIndex].subTopic, message.toString())
                    }
                }
            } else {
                this.emit("unknown", "")
            }

        })
    }

    private async publishOnline(sensors: SensorEntities, controls: ControlEntities[], commands: CommandEntities): Promise<any> {
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
            await this.publish("online", "bridge/availability", true)

            // Advertise the presence of all sensor entities
            for (let entity in sensors.entities) {
                const thisEntity = {
                    availability: availability,
                    device: device,
                    state_topic: `${this.config.baseTopic}/${sensors.subTopic}/state`,
                    json_attributes_topic: `${this.config.baseTopic}/${sensors.subTopic}/state`,
                    object_id: sensors.entities[entity].unique_id,
                    force_update: true,
                    ...sensors.entities[entity],
                }
                await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, true)
            }

            // Advertise the presence of all command entities
            for (let entity in commands.entities) {
                const thisEntity = {
                    availability: availability,
                    device: device,
                    state_topic: `${this.config.baseTopic}/${commands.subTopic}/state`,
                    command_topic: `${this.config.baseTopic}/${commands.subTopic}/set`,
                    object_id: commands.entities[entity].unique_id,
                    ...commands.entities[entity],
                }
                await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, true)
            }

            // Advertise the presence of all control entities in the array of controlEntities
            for (let controlsIndex in controls) {
                for (let entity in controls[controlsIndex].entities) {
                    const thisEntity = {
                        availability: availability,
                        device: device,
                        state_topic: `${this.config.baseTopic}/${controls[controlsIndex].subTopic}/state`,
                        command_topic: `${this.config.baseTopic}/${controls[controlsIndex].subTopic}/set`,
                        object_id: controls[controlsIndex].entities[entity].unique_id,
                        ...controls[controlsIndex].entities[entity],
                    }
                    await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, true)
                }
            }

            // Advertise the SolarPi status entity
            const thisEntity = {
                availability: availability,
                device: device,
                state_topic: `${this.config.baseTopic}/status/state`,
                object_id: "solarpi_status",
                name: "Command Status",
                type: "sensor",
                unique_id: "solarpi_command_status",
                value_template: "{{ value_json.message }}"
            }
            await this.publishJSONdiscovery(`${this.config.discoveryTopic}/${thisEntity.type}/${thisEntity.unique_id}/config`, thisEntity, true)

        } catch (ex) {
            console.log(`${logDate()} publishOnline() error: ${ex}`)
        }
    }

    private async subscribe(subTopic: string) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected"
            }
            await this.mqttClient.subscribe(subTopic)
        } catch (error) {
            throw `subscribe() error ${error}`
        }
    }

    private async publish(data: string, subTopic: string, retain?: boolean) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected to broker"
            }
            await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, data,
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publish() error ${error}`
        }
    }

    public async publishControlData(controlData: ControlData[]) {
        //TODO make this more robust by checking that the topic in the data is 
        // one of the topics in this.controlEntities[].subTopic

        for (let controlDataIndex in controlData) {
            await this.publishData(controlData[controlDataIndex].values, `${controlData[controlDataIndex].subTopic}/state`, true)
        }
    }

    public async publishSensorData(data: object) {
        return this.publishData(data, `${this.sensorEntities.subTopic}/state`, true)
    }

    public async publishCommandResponse(data: object) {
        return this.publishData(data, "inverter/state")
    }

    private async publishData(data: object, subTopic: string, retain?: boolean) {
        //try {
        if (!this.mqttClient.connected) {
            throw "Not connected"
        }
        await this.mqttClient.publish(`${this.config.baseTopic}/${subTopic}`, JSON.stringify(data),
            { retain: retain || false } as IClientPublishOptions)
        //} catch (error) {
        //    throw `publishJSON() error ${error}`
        //}
    }

    private async publishJSONdiscovery(discoveryTopic: string, data: object, retain?: boolean) {
        try {
            if (!this.mqttClient.connected) {
                throw "Not connected"
            }
            await this.mqttClient.publish(`${discoveryTopic}`, JSON.stringify(data),
                { retain: retain || false } as IClientPublishOptions)
        } catch (error) {
            throw `publishJSONdiscovery() error ${error}`
        }
    }
}
