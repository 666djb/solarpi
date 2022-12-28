export interface growattEntity {
    name: string,
    type: string,
    device_class?: string,
    state_class?: string,
    unit_of_measurement?: string,
    unique_id: string,
    icon?: string
}

const entities: growattEntity[] = [
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
        name: "Inverter Temperature",
        type: "sensor",
        device_class: "temperature",
        state_class: "measurement",
        unit_of_measurement: "°C",
        unique_id: "solarpi_temperature_inverter"
    },
    {
        name: "Battery Discharge",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_discharge",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Battery Charge",
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
        name: "To User Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_user",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To User Power All",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_user_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Export Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_grid",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Export Power All",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_grid_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To Load Power",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_load",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To Load Power All",
        type: "sensor",
        device_class: "power",
        state_class: "measurement",
        unit_of_measurement: "W",
        unique_id: "solarpi_power_to_load_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To User Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_to_user_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To Grid Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_to_grid_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Discharge Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_discharge_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Charge Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_charge_total",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "To Load Energy Total",
        type: "sensor",
        device_class: "energy",
        state_class: "total",
        unit_of_measurement: "kWh",
        unique_id: "solarpi_energy_to load_total",
        icon: "mdi:lightning-bolt"
    }
]

// This maps from the names used in the Growatt documentation (but camelCased) to the unique_ids used here
const growattMap = {
    "inverterStatus": "solarpi_inverter_status",
    "ppv": "solarpi_power_pv",
    "vpv1": "solarpi_voltage_pv1",
    //"pv1Curr": undefined,
    "ppv1": "solarpi_power_pv1",
    "vpv2": "solarpi_voltage_pv2",
    //"pv2Curr": undefined,
    "ppv2": "solarpi_power_pv2",
    "inverterTemperature": "solarpi_temperature_inverter",
    "pDischarge": "solarpi_power_discharge",
    "pCharge": "solarpi_power_charge",
    "soc": "solarpi_state_of_charge",
    "pToUser": "solarpi_power_to_user",
    "pToUserTotal": "solarpi_power_to_user_total",
    "pToGrid": "solarpi_power_to_grid",
    "pToGridTotal": "solarpi_power_to_grid_total",
    "pToLocalLoad": "solarpi_power_to_load",
    "pToLocalLoadTotal": "solarpi_power_to_load_total",
    "eToUserTotal": "solarpi_energy_to_user_total",
    "eToGridTotal": "solarpi_energy_to_grid_total",
    "eDischargeTotal": "solarpi_energy_discharge_total",
    "eChargeTotal": "solarpi_energy_charge_total",
    "eLocalLoadTotal": "solarpi_energy_to load_total"

}

export function getEntities(): growattEntity[] {
    return entities
}

export function getEntityfromMap(gwClientString: string): string {
    return growattMap[gwClientString]
}
