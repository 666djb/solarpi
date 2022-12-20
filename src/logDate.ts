export function logDate() {
    const date = new Date(Date.now())
    return date.toLocaleString("en-GB", { timeZoneName: "short" })
}