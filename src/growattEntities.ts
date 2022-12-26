export interface growattEntity {
    name: string,
    type: string,
    id: string,
    icon: string
}

const entities: growattEntity[] = [
    {
        name: "Energy Today",
        type: "sensor",
        id: "solarpi_energy_today",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "Energy Lifetime",
        type: "sensor",
        id: "solarpi_energy_lifetime",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV1 Power",
        type: "sensor",
        id: "solarpi_pv1_power",
        icon: "mdi:lightning-bolt"
    },
    {
        name: "PV2 Power",
        type: "sensor",
        id: "solarpi_pv2_power",
        icon: "mdi:lightning-bolt"
    }
]

const growattMap = {
    "todayEnergy": "solarpi_energy_today",
    "totalEnergy": "solarpi_energy_lifetime",
    "pv1Current": "solarpi_pv1_power",
    "pv2Current": "solarpi_pv2_power"
}

export function getEntities(): growattEntity[] {
    return entities
}

export function getEntityfromMap(gwClientString: string): string {
    return growattMap[gwClientString]
}
