// Todo need to add device class and unit of measurement
const entities = [
    {
        name: "Inverter Status",
        type: "sensor",
        unique_id: "solarpi_inverter_status"
    },
    {
        name: "Total PV Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "kW",
        unique_id: "solarpi_total_pv_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV1 Voltage",
        type: "sensor",
        device_class: "voltage",
        unit_of_measurement: "V",
        unique_id: "solarpi_pv1_voltage",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV1 Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "W",
        unique_id: "solarpi_pv1_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Voltage",
        type: "sensor",
        device_class: "voltage",
        unit_of_measurement: "V",
        unique_id: "solarpi_pv2_voltage",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "W",
        unique_id: "solarpi_pv2_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Output Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "W",
        unique_id: "solarpi_output_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Energy Today",
        type: "sensor",
        device_class: "energy",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_today",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Energy Lifetime",
        type: "sensor",
        device_class: "energy",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_lifetime",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Inverter Temperature",
        type: "sensor",
        device_class: "temperature",
        unit_of_measurement: "°C",
        unique_id: "solarpi_inverter_temperature"
    },
    {
        name: "State of Charge",
        type: "sensor",
        unit_of_measurement: "%",
        unique_id: "solarpi_state_of_charge"
    }
];
// This maps from the names used in the Growatt documentation (but camelCased) to the unique_ids used here
const growattMap = {
    "inverterStatus": "solarpi_inverter_status",
    "ppv": "solarpi_total_pv_power",
    "vpv1": "solarpi_pv1_voltage",
    "pv1Curr": undefined,
    "ppv1": "solarpi_pv1_power",
    "vpv2": "solarpi_pv2_voltage",
    "pv2Curr": undefined,
    "ppv2": "solarpi_pv2_power",
    "pac": "solarpi_output_power",
    "eacToday": "solarpi_energy_today",
    "eacTotal": "solarpi_energy_lifetime",
    "inverterTemperature": "solarpi_inverter_temperature",
    "soc": "solarpi_state_of_charge"
};
export function getEntities() {
    return entities;
}
export function getEntityfromMap(gwClientString) {
    return growattMap[gwClientString];
}
