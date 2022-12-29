// Todo turn into class

export interface growattEntity {
    name: string,
    type: string,
    device_class?: string,
    state_class?: string,
    unit_of_measurement?: string,
    unique_id: string,
    value_template: string,
    icon?: string
}

const entities: growattEntity[] = [
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

// This maps from the names used in the Growatt documentation (but camelCased) to the unique_ids used here
const growattMap = {
    "inverterStatus": "solarpi_inverter_status",
    "ppv": "solarpi_power_pv",
    "vpv1": "solarpi_voltage_pv1",
    "ppv1": "solarpi_power_pv1",
    "vpv2": "solarpi_voltage_pv2",
    "ppv2": "solarpi_power_pv2",
    "epvTotal": "solarpi_energy_pv_total",
    "inverterTemperature": "solarpi_temperature_inverter",
    "pDischarge": "solarpi_power_discharge",
    "pCharge": "solarpi_power_charge",
    "soc": "solarpi_state_of_charge",
    "pImport": "solarpi_power_import",
    "pExport": "solarpi_power_export",
    "pLoad": "solarpi_power_to_load",
    "eImportTotal": "solarpi_energy_import_total",
    "eExportTotal": "solarpi_energy_export_total",
    "eDischargeTotal": "solarpi_energy_discharge_total",
    "eChargeTotal": "solarpi_energy_charge_total",
    "eLoadTotal": "solarpi_energy_to_load_total"

}

export function getEntities(): growattEntity[] {
    return entities
}

export function getEntityfromMap(gwClientString: string): string {
    return growattMap[gwClientString]
}
