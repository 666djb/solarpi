// Todo turn into class
// Apart from the interface everything here is specific to SPH3000
export class GrowattSPH3000 {
    constructor() {
        this.entities = [
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
        ];
        this.inputRegister1Start = 0;
        this.inputRegister1Count = 106;
        this.inputRegister2Start = 1000;
        this.inputRegister2Count = 64;
    }
    parseInputRegisters1(inputRegisters) {
        const { data } = inputRegisters;
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
        };
        const errorMap = {
            201: 'Leakage current too high',
            202: 'The DC input voltage is exceeding the maximum tolerable value.',
            203: 'Insulation problem',
            300: 'Utility grid voltage is out of permissible range.',
            302: 'No AC connection',
            303: 'Utility grid frequency out of permissible range.',
            304: 'Voltage of Neutral and PE above 30V.',
            407: 'Auto test didn’t pass.'
        };
        return {
            inverterStatus: statusMap[data[0]] || data[0],
            ppv: (data[1] << 16 | data[2]) / 10.0,
            vpv1: data[3] / 10.0,
            ppv1: (data[5] << 16 | data[6]) / 10.0,
            vpv2: data[7] / 10.0,
            ppv2: (data[9] << 16 | data[10]) / 10.0,
            //epvToday: (data[53] << 16 | data[54]) /10.0, // Combined PV energy today (kWH) *** This does not give a sane result, so trying the next line
            epvToday: ((data[59] << 16 | data[60]) + (data[63] << 16 | data[64])) / 10.0,
            epvTotal: (data[91] << 16 | data[92]) / 10.0,
            inverterTemperature: data[93] / 10.0,
            inverterError: errorMap[data[105]] || data[105]
        };
    }
    parseInputRegisters2(inputRegisters) {
        const { data } = inputRegisters;
        return {
            pDischarge: (data[9] << 16 | data[10]) / 10.0,
            pCharge: (data[11] << 16 | data[12]) / 10.0,
            soc: data[14],
            pImport: (data[21] << 16 | data[22]) / 10.0,
            pExport: (data[29] << 16 | data[30]) / 10.0,
            pLoad: (data[37] << 16 | data[38]) / 10.0,
            eImportToday: (data[44] << 16 | data[45]) / 10.0,
            eImportTotal: (data[46] << 16 | data[47]) / 10.0,
            eExportToday: (data[48] << 16 | data[49]) / 10.0,
            eExportTotal: (data[50] << 16 | data[51]) / 10.0,
            eDischargeToday: (data[52] << 16 | data[53]) / 10.0,
            eDischargeTotal: (data[54] << 16 | data[55]) / 10.0,
            eChargeToday: (data[56] << 16 | data[57]) / 10.0,
            eChargeTotal: (data[58] << 16 | data[59]) / 10.0,
            eLoadToday: (data[60] << 16 | data[61]) / 10.0,
            eLoadTotal: (data[62] << 16 | data[63]) / 10.0, // Load energy total (kWh)
        };
    }
}
