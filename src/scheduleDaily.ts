import { logDate } from "./logDate.js"

export function scheduleDaily(toRun: () => Promise<void>) {
    const now = new Date()
    const nextRun = new Date(now)

    nextRun.setHours(2, 0, 0, 0)

    // If today's 02:00 has passed, schedule tomorrow.
    if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1)
    }

    const delay = nextRun.getTime() - now.getTime()

    setTimeout(async () => {
        try {
            await toRun()
            console.log(`${logDate()} Executed scheduled daily task`)
        } catch (error) {
            console.error(`${logDate()} Error executing scheduled daily task:`, error)
        }

        scheduleDaily(toRun)
    }, delay)
}