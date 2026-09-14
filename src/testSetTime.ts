// Test getting the local system time in preparation for sending to inverter
function getLocalTime() {

    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    console.log(`Local time is ${hours}:${minutes}:${seconds}`)
}

getLocalTime()

/*
async function setLocalTime(modbusClient: any) {
    const now = new Date();

    const values = [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    ];

    await modbusClient.writeRegisters(45, values);

    console.log("Sent inverter time:", values);
}
    */