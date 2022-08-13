export function sleep(miliseconds: number) {
    return new Promise((resolve)=> setTimeout(resolve, miliseconds))
}

class TimeoutError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'TimeoutError'
    }
}

export function sleepReject(miliseconds: number, rejectMessage?: string) {
    return new Promise((_, reject)=> setTimeout(() => reject(new TimeoutError(rejectMessage || 'timed out')), miliseconds))
}



export async function executeForAtLeast<T>(promise: Promise<T>, miliseconds: number ): Promise<T> {
    const result = await Promise.all([ promise, sleep(miliseconds) ])
    return result[0]
}

export async function executeForAtMost<T>(promise: Promise<T>, miliseconds: number, rejectMessage?: string ): Promise<T> {
    const result = await Promise.race([ promise, sleepReject(miliseconds, rejectMessage) ])
    return result as T
}

