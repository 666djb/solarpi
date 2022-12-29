// Todo turn into class
// Apart from the interface everything here is specific to SPH3000

import { ReadRegisterResult } from "modbus-serial/ModbusRTU";
import { growattEntity } from "./growattEntity";

export class GrowattSPH3000 {
    readonly entities: growattEntity[] = [
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
            value_template: "{{ value_json.ppv2 }}",
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
            name: "Inverter Temperature",
            type: "sensor",
            device_class: "temperature",
            state_class: "measurement",
            unit_of_measurement: "°C",
            unique_id: "solarpi_temperature_inverter",
            value_template: "{{ value_json.inverterTemperature }}"
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

    readonly inputRegister1Start = 0
    readonly inputRegister1Count = 125
    readonly inputRegister2Start = 1000
    readonly inputRegister2Count = 64

    public parseInputRegisters1(inputRegisters: ReadRegisterResult) {
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
            inverterStatus: statusMap[data[0]] || data[0],
            ppv: (data[1] << 16 | data[2]) / 10.0, //W --- total PV power
            vpv1: data[3] / 10.0, //V
            pv1Curr: data[4] / 10.0, //A
            ppv1: (data[5] << 16 | data[6]) / 10.0, //W
            vpv2: data[7] / 10.0, //V
            pv2Curr: data[8] / 10.0, //A
            ppv2: (data[9] << 16 | data[10]) / 10.0, //W
            //pac: (data[35] << 16 | data[36]) / 10.0, // W --- I think this is local consumption
            //fac: data[37] / 100.0, // Hz
            //vac: data[38] / 10.0, //V
            //iac: data[39] / 10.0, //A
            //pac1: (data[40] << 16 | data[41]) / 10.0, //VA
            //eacToday: (data[53] << 16 | data[54]) / 10.0, //kWh --- I think this is grid consumption/export
            //eacTotal: (data[55] << 16 | data[56]) / 10.0, //kWh
            //totalWorkTime: (data[57] << 16 | data[58]) / 2, //s
            //pv1TodayEnergy: (data[59] << 16 | data[60]) / 10.0, //kWh
            //pv1TotalEnergy: (data[61] << 16 | data[62]) / 10.0, //kWh
            //pv2TodayEnergy: (data[63] << 16 | data[64]) / 10.0, //kWh
            //pv2TotalEnergy: (data[65] << 16 | data[66]) / 10.0, //kWh
            epvTotal: (data[91] << 16 | data[92]) / 10.0, //kWh
            inverterTemperature: data[93] / 10.0, //°C
            error: errorMap[data[105]] || data[105]
        }
    }

    public parseInputRegisters2(inputRegisters: ReadRegisterResult) {
        const { data } = inputRegisters
        return {
            pDischarge: (data[9] << 16 | data[10]) / 10.0, // W battery charge
            pCharge: (data[11] << 16 | data[12]) / 10.0, // W battery discharge
            soc: data[14], // % state of charge
            pImport: (data[21] << 16 | data[22]) / 10.0, // W consumption from grid *** assumed
            pExport: (data[29] << 16 | data[30]) / 10.0, // W export to grid *** assumed same as above
            pLoad: (data[37] << 16 | data[38]) / 10.0, // W inverter to local load *** assumed same as above
            eImportTotal: (data[46] << 16 | data[47]) / 10.0, // kWh
            eExportTotal: (data[50] << 16 | data[51]) / 10.0, // kWh
            eDischargeTotal: (data[54] << 16 | data[55]) / 10.0, // kWh
            eChargeTotal: (data[58] << 16 | data[59]) / 10.0, // kWh
            eLoadTotal: (data[62] << 16 | data[63]) / 10.0, // kWh
        }
    }
}
