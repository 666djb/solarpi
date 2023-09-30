// This class is specific to Growatt SPH3000 inverter but is likely to
// work for other SPH inverters unless these have more than 2 strings
// of panels (then only the first two will be read)

import { ModbusRTU, ReadRegisterResult, WriteMultipleResult } from "modbus-serial/ModbusRTU"
import { Inverter, Command, SensorEntity, ControlEntity, SensorEntities, ControlEntities, CommandEntity, CommandEntities, ControlData } from "./inverter"
import Ajv from "ajv"
import { Mutex } from 'async-mutex'
import { logDate } from "./logDate.js"

interface TouChargingValues {
    chargePower: number,
    stopSOC: number,
    ac: string,
    timePeriod1StartHour: number,
    timePeriod1StartMinute: number,
    timePeriod1StopHour: number,
    timePeriod1StopMinute: number,
    timePeriod1Enable: string,
    timePeriod2StartHour: number,
    timePeriod2StartMinute: number,
    timePeriod2StopHour: number,
    timePeriod2StopMinute: number,
    timePeriod2Enable: string,
    timePeriod3StartHour: number,
    timePeriod3StartMinute: number,
    timePeriod3StopHour: number,
    timePeriod3StopMinute: number,
    timePeriod3Enable: string
}

interface TouDischargingValues {
    dischargePower: number,
    dischargeStopSOC: number,
    discharge1StartHour: number,
    discharge1StartMinute: number,
    discharge1StopHour: number,
    discharge1StopMinute: number,
    discharge1Enable: string,
    discharge2StartHour: number,
    discharge2StartMinute: number,
    discharge2StopHour: number,
    discharge2StopMinute: number,
    discharge2Enable: string,
    discharge3StartHour: number,
    discharge3StartMinute: number,
    discharge3StopHour: number,
    discharge3StopMinute: number,
    discharge3Enable: string
}

interface TimeValues {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
}

export class GrowattSPH3000 implements Inverter {
    mutex = new Mutex()

    private sensorEntities: SensorEntity[] = [
        {
            name: "Inverter Status",
            type: "sensor",
            unique_id: "solarpi_inverter_status",
            value_template: "{{ value_json.inverterStatus }}"
        },
        {
            name: "PV Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_pv",
            value_template: "{{ value_json.ppv }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV1 Voltage",
            type: "sensor",
            device_class: "voltage",
            unit_of_measurement: "V",
            unique_id: "solarpi_voltage_pv1",
            value_template: "{{ value_json.vpv1 }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV1 Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_pv1",
            value_template: "{{ value_json.ppv1 }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV2 Voltage",
            type: "sensor",
            device_class: "voltage",
            unit_of_measurement: "V",
            unique_id: "solarpi_voltage_pv2",
            value_template: "{{ value_json.vpv2 }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV2 Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_pv2",
            value_template: "{{ value_json.ppv2 }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_pv_today",
            value_template: "{{ value_json.epvToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "PV Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_pv_total",
            value_template: "{{ value_json.epvTotal }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Grid Voltage",
            type: "sensor",
            device_class: "voltage",
            unit_of_measurement: "V",
            unique_id: "solarpi_voltage_grid",
            value_template: "{{ value_json.vgrid }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Inverter Temperature",
            type: "sensor",
            device_class: "temperature",
            state_class: "measurement",
            unit_of_measurement: "°C",
            unique_id: "solarpi_temperature_inverter",
            value_template: "{{ value_json.inverterTemperature }}"
        },
        {
            name: "Inverter Error",
            type: "sensor",
            unique_id: "solarpi_inverter_error",
            value_template: "{{ value_json.inverterError }}"
        },
        {
            name: "Battery Discharge Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_discharge",
            value_template: "{{ value_json.pDischarge }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Battery Charge Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_charge",
            value_template: "{{ value_json.pCharge }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "State of Charge",
            type: "sensor",
            state_class: "measurement",
            unit_of_measurement: "%",
            unique_id: "solarpi_state_of_charge",
            value_template: "{{ value_json.soc }}"
        },
        {
            name: "Import Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_import",
            value_template: "{{ value_json.pImport }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Export Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_export",
            value_template: "{{ value_json.pExport }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Load Power",
            type: "sensor",
            device_class: "power",
            state_class: "measurement",
            unit_of_measurement: "W",
            unique_id: "solarpi_power_to_load",
            value_template: "{{ value_json.pLoad }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Import Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_import_today",
            value_template: "{{ value_json.eImportToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Import Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_import_total",
            value_template: "{{ value_json.eImportTotal }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Export Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_export_today",
            value_template: "{{ value_json.eExportToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Export Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_export_total",
            value_template: "{{ value_json.eExportTotal }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Battery Discharge Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_discharge_today",
            value_template: "{{ value_json.eDischargeToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Battery Discharge Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_discharge_total",
            value_template: "{{ value_json.eDischargeTotal }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Battery Charge Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_charge_today",
            value_template: "{{ value_json.eChargeToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Battery Charge Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_charge_total",
            value_template: "{{ value_json.eChargeTotal }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Load Energy Today",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_to_load_today",
            value_template: "{{ value_json.eLoadToday }}",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Load Energy Total",
            type: "sensor",
            device_class: "energy",
            state_class: "total",
            unit_of_measurement: "kWh",
            unique_id: "solarpi_energy_to_load_total",
            value_template: "{{ value_json.eLoadTotal }}",
            icon: "mdi:lightning-bolt"
        }
    ]

    private commandEntities: CommandEntity[] = [
        {
            name: "Get TOU Charge",
            type: "button",
            unique_id: "solarpi_tou_charge_get",
            command_template: '{ "command": {{ value }} }',
            payload_press: '"getTouCharging"',
            icon: "mdi:help"
        },
        {
            name: "Set TOU Charge",
            type: "button",
            unique_id: "solarpi_tou_charge_set",
            command_template: '{ "command": {{ value }} }',
            payload_press: '"setTouCharging"',
            icon: "mdi:check"
        },
        {
            name: "Get TOU Discharge",
            type: "button",
            unique_id: "solarpi_tou_discharge_get",
            command_template: '{ "command": {{ value }} }',
            payload_press: '"getTouDischarging"',
            icon: "mdi:help"
        },
        {
            name: "Set TOU Discharge",
            type: "button",
            unique_id: "solarpi_tou_discharge_set",
            command_template: '{ "command": {{ value }} }',
            payload_press: '"setTouDischarging"',
            icon: "mdi:check"
        },
        {
            name: "Get Inverter Time",
            type: "button",
            unique_id: "solarpi_time_get",
            command_template: '{ "command": {{ value }} }',
            payload_press: '"getTime"',
            icon: "mdi:check"
        }
    ]

    //TODO (at next release) make breaking change in the following to simplify
    // timePeriod1StartHour will become charge1StartHour OR startHour1
    // and lose the "Charge" from the name and the "charge" from the JSON and valuetemplate
    // but keep the more verbose uniqueid
    // Will this will require dashboards and automations to be updated????
    private touChargingControlEntities: ControlEntity[] = [
        {
            name: "Charge Power",
            type: "number",
            state_class: "measurement",
            unit_of_measurement: "%",
            unique_id: "solarpi_tou_charge_power",
            value_template: "{{ value_json.chargePower }}",
            command_template: '{{ {"chargePower": value} }}',
            mode: "box",
            min: 0,
            max: 100,
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Charge Stop SOC",
            type: "number",
            state_class: "measurement",
            unit_of_measurement: "%",
            unique_id: "solarpi_tou_charge_stop_soc",
            value_template: "{{ value_json.stopSOC }}",
            command_template: '{{ {"stopSOC": value} }}',
            mode: "box",
            min: 0,
            max: 100,
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Charge Using AC",
            type: "switch",
            unique_id: "solarpi_tou_charge_ac",
            value_template: "{{ value_json.ac }}",
            payload_off: '{"ac": "OFF"}',
            payload_on: '{"ac": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Charge 1 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_1_start_hour",
            value_template: "{{ value_json.timePeriod1StartHour }}",
            command_template: '{{ {"timePeriod1StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 1 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_1_start_minute",
            value_template: "{{ value_json.timePeriod1StartMinute }}",
            command_template: '{{ {"timePeriod1StartMinute": value} }}',
            mode: "box",
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 1 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_1_stop_hour",
            value_template: "{{ value_json.timePeriod1StopHour }}",
            command_template: '{{ {"timePeriod1StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 1 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_1_stop_minute",
            value_template: "{{ value_json.timePeriod1StopMinute }}",
            command_template: '{{ {"timePeriod1StopMinute": value} }}',
            mode: "box",
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 1 Enable",
            type: "switch",
            unique_id: "solarpi_tou_charge_1_enable",
            value_template: "{{ value_json.timePeriod1Enable }}",
            payload_off: '{"timePeriod1Enable": "OFF"}',
            payload_on: '{"timePeriod1Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Charge 2 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_2_start_hour",
            value_template: "{{ value_json.timePeriod2StartHour }}",
            command_template: '{{ {"timePeriod2StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 2 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_2_start_minute",
            value_template: "{{ value_json.timePeriod2StartMinute }}",
            command_template: '{{ {"timePeriod2StartMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 2 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_2_stop_hour",
            value_template: "{{ value_json.timePeriod2StopHour }}",
            command_template: '{{ {"timePeriod2StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 2 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_2_stop_minute",
            value_template: "{{ value_json.timePeriod2StopMinute }}",
            command_template: '{{ {"timePeriod2StopMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 2 Enable",
            type: "switch",
            unique_id: "solarpi_tou_charge_2_enable",
            value_template: "{{ value_json.timePeriod2Enable }}",
            payload_off: '{"timePeriod2Enable": "OFF"}',
            payload_on: '{"timePeriod2Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Charge 3 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_3_start_hour",
            value_template: "{{ value_json.timePeriod3StartHour }}",
            command_template: '{{ {"timePeriod3StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 3 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_3_start_minute",
            value_template: "{{ value_json.timePeriod3StartMinute }}",
            command_template: '{{ {"timePeriod3StartMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 3 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_charge_3_stop_hour",
            value_template: "{{ value_json.timePeriod3StopHour }}",
            command_template: '{{ {"timePeriod3StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 3 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_charge_3_stop_minute",
            value_template: "{{ value_json.timePeriod3StopMinute }}",
            command_template: '{{ {"timePeriod3StopMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Charge 3 Enable",
            type: "switch",
            unique_id: "solarpi_tou_charge_3_enable",
            value_template: "{{ value_json.timePeriod3Enable }}",
            payload_off: '{"timePeriod3Enable": "OFF"}',
            payload_on: '{"timePeriod3Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        }
    ]

    private touDischargingControlEntities: ControlEntity[] = [
        {
            name: "Discharge Power",
            type: "number",
            state_class: "measurement",
            unit_of_measurement: "%",
            unique_id: "solarpi_tou_discharge_power",
            value_template: "{{ value_json.dischargePower }}",
            command_template: '{{ {"dischargePower": value} }}',
            mode: "box",
            min: 0,
            max: 100,
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Discharge Stop SOC",
            type: "number",
            state_class: "measurement",
            unit_of_measurement: "%",
            unique_id: "solarpi_tou_discharge_stop_soc",
            value_template: "{{ value_json.dischargeStopSOC }}",
            command_template: '{{ {"dischargeStopSOC": value} }}',
            mode: "box",
            min: 0,
            max: 100,
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Discharge 1 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_1_start_hour",
            value_template: "{{ value_json.discharge1StartHour }}",
            command_template: '{{ {"discharge1StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 1 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_1_start_minute",
            value_template: "{{ value_json.discharge1StartMinute }}",
            command_template: '{{ {"discharge1StartMinute": value} }}',
            mode: "box",
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 1 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_1_stop_hour",
            value_template: "{{ value_json.discharge1StopHour }}",
            command_template: '{{ {"discharge1StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 1 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_1_stop_minute",
            value_template: "{{ value_json.discharge1StopMinute }}",
            command_template: '{{ {"discharge1StopMinute": value} }}',
            mode: "box",
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 1 Enable",
            type: "switch",
            unique_id: "solarpi_tou_discharge_1_enable",
            value_template: "{{ value_json.discharge1Enable }}",
            payload_off: '{"discharge1Enable": "OFF"}',
            payload_on: '{"discharge1Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Discharge 2 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_2_start_hour",
            value_template: "{{ value_json.discharge2StartHour }}",
            command_template: '{{ {"discharge2StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 2 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_2_start_minute",
            value_template: "{{ value_json.discharge2StartMinute }}",
            command_template: '{{ {"discharge2StartMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 2 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_2_stop_hour",
            value_template: "{{ value_json.discharge2StopHour }}",
            command_template: '{{ {"discharge2StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 2 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_2_stop_minute",
            value_template: "{{ value_json.discharge2StopMinute }}",
            command_template: '{{ {"discharge2StopMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 2 Enable",
            type: "switch",
            unique_id: "solarpi_tou_discharge_2_enable",
            value_template: "{{ value_json.discharge2Enable }}",
            payload_off: '{"discharge2Enable": "OFF"}',
            payload_on: '{"discharge2Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        },
        {
            name: "Discharge 3 Start Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_3_start_hour",
            value_template: "{{ value_json.discharge3StartHour }}",
            command_template: '{{ {"discharge3StartHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 3 Start Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_3_start_minute",
            value_template: "{{ value_json.discharge3StartMinute }}",
            command_template: '{{ {"discharge3StartMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 3 Stop Hour",
            type: "number",
            unique_id: "solarpi_tou_discharge_3_stop_hour",
            value_template: "{{ value_json.discharge3StopHour }}",
            command_template: '{{ {"discharge3StopHour": value} }}',
            mode: "box",
            min: 0,
            max: 23,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 3 Stop Minute",
            type: "number",
            unique_id: "solarpi_tou_discharge_3_stop_minute",
            value_template: "{{ value_json.discharge3StopMinute }}",
            command_template: '{{ {"discharge3StopMinute": value} }}',
            mode: "box",
            min: 0,
            max: 59,
            icon: "mdi:clock-outline"
        },
        {
            name: "Discharge 3 Enable",
            type: "switch",
            unique_id: "solarpi_tou_discharge_3_enable",
            value_template: "{{ value_json.discharge3Enable }}",
            payload_off: '{"discharge3Enable": "OFF"}',
            payload_on: '{"discharge3Enable": "ON"}',
            state_off: "OFF",
            state_on: "ON",
            icon: "mdi:lightning-bolt"
        }
    ]

    // Object to retain TOU charging values which have been read from the inverter
    // or modified by MQTT messages
    private touChargingValues: TouChargingValues = {
        chargePower: 100,
        stopSOC: 100,
        ac: "OFF",
        timePeriod1StartHour: 0,
        timePeriod1StartMinute: 0,
        timePeriod1StopHour: 0,
        timePeriod1StopMinute: 0,
        timePeriod1Enable: "OFF",
        timePeriod2StartHour: 0,
        timePeriod2StartMinute: 0,
        timePeriod2StopHour: 0,
        timePeriod2StopMinute: 0,
        timePeriod2Enable: "OFF",
        timePeriod3StartHour: 0,
        timePeriod3StartMinute: 0,
        timePeriod3StopHour: 0,
        timePeriod3StopMinute: 0,
        timePeriod3Enable: "OFF"
    }

    // Object to retain TOU charging values which have been read from the inverter
    // or modified by MQTT messages
    private touDischargingValues: TouDischargingValues = {
        dischargePower: 100,
        dischargeStopSOC: 10, //TODO check this makes sense as a default
        discharge1StartHour: 0,
        discharge1StartMinute: 0,
        discharge1StopHour: 0,
        discharge1StopMinute: 0,
        discharge1Enable: "OFF",
        discharge2StartHour: 0,
        discharge2StartMinute: 0,
        discharge2StopHour: 0,
        discharge2StopMinute: 0,
        discharge2Enable: "OFF",
        discharge3StartHour: 0,
        discharge3StartMinute: 0,
        discharge3StopHour: 0,
        discharge3StopMinute: 0,
        discharge3Enable: "OFF"
    }

    // Wrapper methods to allow use of mutex as it seems ModbusRTU allows
    // read and writes to overlap
    // TODO create class that extends ModbusRTU with mutexed methods (and with timeouts)
    private async readInputRegisters(modbusClient: ModbusRTU, dataAddress: number, length: number): Promise<ReadRegisterResult> {
        const release = await this.mutex.acquire()
        let result: ReadRegisterResult
        try {
            result = await modbusClient.readInputRegisters(dataAddress, length)
        } finally {
            release()
        }
        return result
    }

    private async readHoldingRegisters(modbusClient: ModbusRTU, dataAddress: number, length: number): Promise<ReadRegisterResult> {
        const release = await this.mutex.acquire()
        let result: ReadRegisterResult
        try {
            result = await modbusClient.readHoldingRegisters(dataAddress, length)
        } finally {
            release()
        }
        return result
    }

    private async writeRegisters(modbusClient: ModbusRTU, dataAddress: number, values: number[] | Buffer): Promise<WriteMultipleResult> {
        const release = await this.mutex.acquire()
        let result: WriteMultipleResult
        try {
            result = await modbusClient.writeRegisters(dataAddress, values)
        } finally {
            release()
        }
        return result
    }

    public getSensorEntities(): SensorEntities {
        return {
            subTopic: "inverter",
            entities: this.sensorEntities
        }
    }

    public getCommandEntities(): CommandEntities {
        return {
            subTopic: "command",
            entities: this.commandEntities
        }
    }

    public getControlEntities(): ControlEntities[] {
        return [
            {
                subTopic: "touCharging",
                entities: this.touChargingControlEntities
            },
            {
                subTopic: "touDischarging",
                entities: this.touDischargingControlEntities
            }
        ]
    }

    public updateControl(subTopic: string, controlMessage: string): ControlData[] {
        //console.log(`DEBUG got controlMessage:`, controlMessage)

        try {
            const control = JSON.parse(controlMessage.replace(/'/g, '"'))
            const keys = Object.keys(control)
            keys.forEach((key, index) => {
                if (subTopic == 'touCharging' && typeof this.touChargingValues[key] !== 'undefined') {
                    this.touChargingValues[key] = control[key]
                } else if (subTopic == 'touDischarging' && typeof this.touDischargingValues[key] !== 'undefined') {
                    this.touDischargingValues[key] = control[key]
                }
            })
        } catch (error) {
            console.log(`${logDate()} Error parsing controlMessage in updateControl(). Continuing.`)
        }

        // Return all the control values (could be reduced to just the set that have been updated)
        return [
            {
                subTopic: "touCharging",
                values: this.touChargingValues
            },
            {
                subTopic: "touDischarging",
                values: this.touDischargingValues
            }
        ]
    }

    public async getControlValues(modbusClient: ModbusRTU): Promise<ControlData[]> {
        return [
            {
                subTopic: "touCharging",
                values: await this.getTouCharging(modbusClient)
            },
            {
                subTopic: "touDischarging",
                values: await this.getTouDischarging(modbusClient)
            }
        ]
    }

    public async getSensorData(modbusClient: ModbusRTU): Promise<{}> {
        // For SPH3000 read the first 106 register values starting at address 0, then the first 64 register values
        // starting at address 1000
        const inputRegisters1 = await this.readInputRegisters(modbusClient, 0, 106)
        const inputRegisters2 = await this.readInputRegisters(modbusClient, 1000, 64)

        // Parse these two buffers then combine into an object and return
        return { ...this.parseInputRegisters1(inputRegisters1), ...this.parseInputRegisters2(inputRegisters2) }
    }

    private async setTouCharging(modbusClient: ModbusRTU): Promise<void> {
        // Validate the contents of touValues object
        const ajv = new Ajv()
        const touValuesSchema = {
            type: "object",
            properties: {
                chargePower: { type: "number", minimum: 0, maximum: 100 },
                stopSOC: { type: "number", minimum: 0, maximum: 100 },
                ac: { type: "string", pattern: "ON|OFF" },
                timePeriod1StartHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod1StartMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod1StopHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod1StopMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod1Enable: { type: "string", pattern: "ON|OFF" },
                timePeriod2StartHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod2StartMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod2StopHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod2StopMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod2Enable: { type: "string", pattern: "ON|OFF" },
                timePeriod3StartHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod3StartMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod3StopHour: { type: "number", minimum: 0, maximum: 23 },
                timePeriod3StopMinute: { type: "number", minimum: 0, maximum: 59 },
                timePeriod3Enable: { type: "string", pattern: "ON|OFF" }
            },
            required: ["chargePower", "stopSOC", "ac", "timePeriod1StartHour", "timePeriod1StartMinute",
                "timePeriod1StopHour", "timePeriod1StopMinute", "timePeriod1Enable", "timePeriod2StartHour",
                "timePeriod2StartMinute", "timePeriod2StopHour", "timePeriod2StopMinute", "timePeriod2Enable",
                "timePeriod3StartHour", "timePeriod3StartMinute", "timePeriod3StopHour", "timePeriod3StopMinute",
                "timePeriod3Enable"],
            additionalProperties: false
        }
        const validate = ajv.compile(touValuesSchema)
        if (!validate(this.touChargingValues)) {
            console.log("Validate errors:", validate.errors)
            throw "Error validating setTouCharging"
        }

        const writeRegisters1: Array<number> = [
            this.touChargingValues.chargePower,
            this.touChargingValues.stopSOC,
            (this.touChargingValues.ac === "ON") ? 1 : 0
        ]

        const writeRegisters2: Array<number> = [
            (this.touChargingValues.timePeriod1StartHour << 8) | this.touChargingValues.timePeriod1StartMinute,
            (this.touChargingValues.timePeriod1StopHour << 8) | this.touChargingValues.timePeriod1StopMinute,
            this.touChargingValues.timePeriod1Enable === "ON" ? 1 : 0,
            (this.touChargingValues.timePeriod2StartHour << 8) | this.touChargingValues.timePeriod2StartMinute,
            (this.touChargingValues.timePeriod2StopHour << 8) | this.touChargingValues.timePeriod2StopMinute,
            this.touChargingValues.timePeriod2Enable === "ON" ? 1 : 0,
            (this.touChargingValues.timePeriod3StartHour << 8) | this.touChargingValues.timePeriod3StartMinute,
            (this.touChargingValues.timePeriod3StopHour << 8) | this.touChargingValues.timePeriod3StopMinute,
            this.touChargingValues.timePeriod3Enable === "ON" ? 1 : 0
        ]

        // Write writeRegisters1 to holding registers 1090-1092
        await this.writeRegisters(modbusClient, 1090, writeRegisters1)

        // Write writeRegisters2 to holding registers 1100-1108
        await this.writeRegisters(modbusClient, 1100, writeRegisters2)
    }

    private async setTouDischarging(modbusClient: ModbusRTU): Promise<void> {
        // Validate the contents of touValues object
        const ajv = new Ajv()
        const touDischargingValuesSchema = {
            type: "object",
            properties: {
                dischargePower: { type: "number", minimum: 0, maximum: 100 },
                dischargeStopSOC: { type: "number", minimum: 0, maximum: 100 },
                discharge1StartHour: { type: "number", minimum: 0, maximum: 23 },
                discharge1StartMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge1StopHour: { type: "number", minimum: 0, maximum: 23 },
                discharge1StopMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge1Enable: { type: "string", pattern: "ON|OFF" },
                discharge2StartHour: { type: "number", minimum: 0, maximum: 23 },
                discharge2StartMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge2StopHour: { type: "number", minimum: 0, maximum: 23 },
                discharge2StopMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge2Enable: { type: "string", pattern: "ON|OFF" },
                discharge3StartHour: { type: "number", minimum: 0, maximum: 23 },
                discharge3StartMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge3StopHour: { type: "number", minimum: 0, maximum: 23 },
                discharge3StopMinute: { type: "number", minimum: 0, maximum: 59 },
                discharge3Enable: { type: "string", pattern: "ON|OFF" }
            },
            required: ["dischargePower", "dischargeStopSOC", "discharge1StartHour", "discharge1StartMinute",
                "discharge1StopHour", "discharge1StopMinute", "discharge1Enable", "discharge2StartHour",
                "discharge2StartMinute", "discharge2StopHour", "discharge2StopMinute", "discharge2Enable",
                "discharge3StartHour", "discharge3StartMinute", "discharge3StopHour", "discharge3StopMinute",
                "discharge3Enable"],
            additionalProperties: false
        }
        const validate = ajv.compile(touDischargingValuesSchema)
        if (!validate(this.touDischargingValues)) {
            console.log("Validate errors:", validate.errors)
            throw "Error validating setTouDischarging"
        }

        const writeRegisters1: Array<number> = [
            this.touDischargingValues.dischargePower,
            this.touDischargingValues.dischargeStopSOC
        ]

        const writeRegisters2: Array<number> = [
            (this.touDischargingValues.discharge1StartHour << 8) | this.touDischargingValues.discharge1StartMinute,
            (this.touDischargingValues.discharge1StopHour << 8) | this.touDischargingValues.discharge1StopMinute,
            this.touDischargingValues.discharge1Enable === "ON" ? 1 : 0,
            (this.touDischargingValues.discharge2StartHour << 8) | this.touDischargingValues.discharge2StartMinute,
            (this.touDischargingValues.discharge2StopHour << 8) | this.touDischargingValues.discharge2StopMinute,
            this.touDischargingValues.discharge2Enable === "ON" ? 1 : 0,
            (this.touDischargingValues.discharge3StartHour << 8) | this.touDischargingValues.discharge3StartMinute,
            (this.touDischargingValues.discharge3StopHour << 8) | this.touDischargingValues.discharge3StopMinute,
            this.touDischargingValues.discharge3Enable === "ON" ? 1 : 0
        ]

        // Write writeRegisters1 to holding registers 1070-1071
        await this.writeRegisters(modbusClient, 1070, writeRegisters1)

        // Write writeRegisters2 to holding registers 1080-1088
        await this.writeRegisters(modbusClient, 1080, writeRegisters2)
    }

    private async getTouCharging(modbusClient: ModbusRTU): Promise<TouChargingValues> {
        const holdingRegisters1 = await this.readHoldingRegisters(modbusClient, 1090, 3)
        const holdingRegisters2 = await this.readHoldingRegisters(modbusClient, 1100, 9)

        const { data: data1 } = holdingRegisters1
        const { data: data2 } = holdingRegisters2

        // TODO review why this is saved to class scoped variable and returned from a private function
        this.touChargingValues = {
            chargePower: data1[0],
            stopSOC: data1[1],
            ac: (data1[2] == 1) ? "ON" : "OFF",
            timePeriod1StartHour: data2[0] >> 8,
            timePeriod1StartMinute: data2[0] & 0xFF,
            timePeriod1StopHour: data2[1] >> 8,
            timePeriod1StopMinute: data2[1] & 0xFF,
            timePeriod1Enable: (data2[2] == 1) ? "ON" : "OFF",
            timePeriod2StartHour: data2[3] >> 8,
            timePeriod2StartMinute: data2[3] & 0xFF,
            timePeriod2StopHour: data2[4] >> 8,
            timePeriod2StopMinute: data2[4] & 0xFF,
            timePeriod2Enable: (data2[5] == 1) ? "ON" : "OFF",
            timePeriod3StartHour: data2[6] >> 8,
            timePeriod3StartMinute: data2[6] & 0xFF,
            timePeriod3StopHour: data2[7] >> 8,
            timePeriod3StopMinute: data2[7] & 0xFF,
            timePeriod3Enable: (data2[8] == 1) ? "ON" : "OFF"
        }

        return this.touChargingValues
    }

    private async getTouDischarging(modbusClient: ModbusRTU): Promise<TouDischargingValues> {
        const holdingRegisters1 = await this.readHoldingRegisters(modbusClient, 1070, 2)
        const holdingRegisters2 = await this.readHoldingRegisters(modbusClient, 1080, 9)

        const { data: data1 } = holdingRegisters1
        const { data: data2 } = holdingRegisters2

        // TODO review why this is saved to class scoped variable and returned from a private function
        this.touDischargingValues = {
            dischargePower: data1[0],
            dischargeStopSOC: data1[1],
            discharge1StartHour: data2[0] >> 8,
            discharge1StartMinute: data2[0] & 0xFF,
            discharge1StopHour: data2[1] >> 8,
            discharge1StopMinute: data2[1] & 0xFF,
            discharge1Enable: (data2[2] == 1) ? "ON" : "OFF",
            discharge2StartHour: data2[3] >> 8,
            discharge2StartMinute: data2[3] & 0xFF,
            discharge2StopHour: data2[4] >> 8,
            discharge2StopMinute: data2[4] & 0xFF,
            discharge2Enable: (data2[5] == 1) ? "ON" : "OFF",
            discharge3StartHour: data2[6] >> 8,
            discharge3StartMinute: data2[6] & 0xFF,
            discharge3StopHour: data2[7] >> 8,
            discharge3StopMinute: data2[7] & 0xFF,
            discharge3Enable: (data2[8] == 1) ? "ON" : "OFF"
        }

        return this.touDischargingValues
    }

    private async getTime(modbusClient: ModbusRTU): Promise<TimeValues> {
        const holdingRegisters = await this.readHoldingRegisters(modbusClient, 45, 6)

        const { data } = holdingRegisters

        return {
            year: data[0],
            month: data[1],
            day: data[2],
            hour: data[3],
            minute: data[4],
            second: data[5]
        }
    }

    public async sendCommand(modbusClient: ModbusRTU, commandString: string): Promise<ControlData[] | null> {
        // First find out what type of command this is
        const command: Command = JSON.parse(commandString)

        // Pass command string to relevant function for parsing and sending to inverter
        switch (command.command) {
            case "setTouCharging":
                console.log(`${logDate()} Received Set TOU Charging command`)
                await this.setTouCharging(modbusClient)
                return null
            case "getTouCharging":
                console.log(`${logDate()} Received Get TOU Charging command`)
                return [
                    {
                        subTopic: "touCharging",
                        values: await this.getTouCharging(modbusClient)
                    }
                ]
            case "setTouDischarging":
                console.log(`${logDate()} Received Set TOU Discharging command`)
                await this.setTouDischarging(modbusClient)
                return null
            case "getTouDischarging":
                console.log(`${logDate()} Received Get TOU Discharging command`)
                return [
                    {
                        subTopic: "touDischarging",
                        values: await this.getTouDischarging(modbusClient)
                    }
                ]
            case "getTime":
                console.log(`${logDate()} Received Get Time command`)
                return [
                    {
                        subTopic: "time",
                        values: await this.getTime(modbusClient)
                    }
                ]
            default:
                throw `Unknown command: ${command.command}`
        }
    }

    private parseInputRegisters1(inputRegisters: ReadRegisterResult) {
        const { data } = inputRegisters

        const statusMap = {
            0: 'Waiting',
            1: 'Self Test',
            2: 'Reserved',
            3: 'Fault',
            4: 'Flash',
            5: 'Normal',
            6: 'Normal',
            7: 'Normal',
            8: 'Normal'
        }

        const errorMap = {
            201: 'Leakage current too high',
            202: 'The DC input voltage is exceeding the maximum tolerable value.',
            203: 'Insulation problem',
            300: 'Utility grid voltage is out of permissible range.',
            302: 'No AC connection',
            303: 'Utility grid frequency out of permissible range.',
            304: 'Voltage of Neutral and PE above 30V.',
            407: 'Auto test didn’t pass.'
        }

        return {
            inverterStatus: statusMap[data[0]] || data[0], // Status from map above or the numeric value
            ppv: (data[1] << 16 | data[2]) / 10.0, // Combined PV power (W)
            vpv1: data[3] / 10.0, // PV1 voltage (V) 
            ppv1: (data[5] << 16 | data[6]) / 10.0, // PV1 power (W)
            vpv2: data[7] / 10.0, // PV2 voltage (V)
            ppv2: (data[9] << 16 | data[10]) / 10.0, // PV2 power (W)
            vgrid: data[38] / 10.0, // Grid voltage (V)
            epvToday: ((data[59] << 16 | data[60]) + (data[63] << 16 | data[64])) / 10.0, // Combined PV energy today (kWH) (achieved by adding PV1 and PV2)
            epvTotal: (data[91] << 16 | data[92]) / 10.0, // Combined PV energy total (kWH)
            inverterTemperature: data[93] / 10.0, //°C
            inverterError: errorMap[data[105]] || data[105]
        }
    }

    private parseInputRegisters2(inputRegisters: ReadRegisterResult) {
        const { data } = inputRegisters
        return {
            pDischarge: (data[9] << 16 | data[10]) / 10.0, // Battery discharge power (W)
            pCharge: (data[11] << 16 | data[12]) / 10.0, // Battery charge power (W)
            soc: data[14], // Battery state of charge (%)
            pImport: (data[21] << 16 | data[22]) / 10.0, // Import power (W)
            pExport: (data[29] << 16 | data[30]) / 10.0, // Export power (W)
            pLoad: (data[37] << 16 | data[38]) / 10.0, // Load (consumption) power (W)
            eImportToday: (data[44] << 16 | data[45]) / 10.0, // Import energy today (kWh)
            eImportTotal: (data[46] << 16 | data[47]) / 10.0, // Import energy total (kWh)
            eExportToday: (data[48] << 16 | data[49]) / 10.0, // Export energy today (kWh)
            eExportTotal: (data[50] << 16 | data[51]) / 10.0, // Export energy total (kWh)
            eDischargeToday: (data[52] << 16 | data[53]) / 10.0, // Battery discharge energy today (kWh)
            eDischargeTotal: (data[54] << 16 | data[55]) / 10.0, // Battery discharge energy total (kWh)
            eChargeToday: (data[56] << 16 | data[57]) / 10.0, // Battery charge energy today (kWh)
            eChargeTotal: (data[58] << 16 | data[59]) / 10.0, // Battery charge energy total (kWh)
            eLoadToday: (data[60] << 16 | data[61]) / 10.0, // Load energy today (kWh)
            eLoadTotal: (data[62] << 16 | data[63]) / 10.0, // Load energy total (kWh)
        }
    }
}
