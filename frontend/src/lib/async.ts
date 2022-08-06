export function sleep(miliseconds: number) {
    return new Promise((resolve)=> setTimeout(resolve, miliseconds))
}

export async function executeForAtLeast<T>(promise: Promise<T>, miliseconds: number ): Promise<T> {
    const result = await Promise.all([ promise, sleep(miliseconds) ])
    return result[0]
}