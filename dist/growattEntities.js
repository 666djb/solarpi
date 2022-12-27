// Todo need to add device class and unit of measurement
const entities = [
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
        name: "PV1 Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "W",
        unique_id: "solarpi_pv1_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Power",
        type: "sensor",
        device_class: "power",
        unit_of_measurement: "W",
        unique_id: "solarpi_pv2_power",
        icon: "mdi:lightning-bolt"
    }
];
const growattMap = {
    "todayEnergy": "solarpi_energy_today",
    "totalEnergy": "solarpi_energy_lifetime",
    "pv1Current": "solarpi_pv1_power",
    "pv2Current": "solarpi_pv2_power"
};
export function getEntities() {
    return entities;
}
export function getEntityfromMap(gwClientString) {
    return growattMap[gwClientString];
}
