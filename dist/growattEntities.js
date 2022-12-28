const entities = [
    {
        name: "Inverter Status",
        type: "sensor",
        unique_id: "solarpi_inverter_status"
    },
    {
        name: "PV Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_pv",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV1 Voltage",
        type: "sensor",
        device_class: "voltage",
        unit_of_measurement: "V",
        unique_id: "solarpi_voltage_pv1",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV1 Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_pv1",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Voltage",
        type: "sensor",
        device_class: "voltage",
        unit_of_measurement: "V",
        unique_id: "solarpi_voltage_pv2",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_pv2",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_pv_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Inverter Temperature",
        type: "sensor",
        device_class: "temperature",
        state_class: "measurement",
        unit_of_measurement: "°C",
        unique_id: "solarpi_temperature_inverter"
    },
    {
        name: "Battery Discharge Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_discharge",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Battery Charge Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_charge",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "State of Charge",
        type: "sensor",
        state_class: "measurement",
        unit_of_measurement: "%",
        unique_id: "solarpi_state_of_charge"
    },
    {
        name: "Import Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_import",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Export Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_export",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Load Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_load",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Import Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_import_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Export Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_export_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Battery Discharge Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_discharge_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Battery Charge Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_charge_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Load Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_to_load_total",
        icon: "mdi:lightning-bolt"
    }
];
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
};
export function getEntities() {
    return entities;
}
export function getEntityfromMap(gwClientString) {
    return growattMap[gwClientString];
}
