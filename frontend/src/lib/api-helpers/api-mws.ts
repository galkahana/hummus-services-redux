import { get } from 'lodash'
import EnhancedError  from './EnhancedError'

// mw for silent or loud fail
export const silentFail = async<T>(call: () => Promise<T>) => {
    try {
        const response = await call()
        return response
    } catch (error) {
        return null
    }
}

// mw for verbose error
export const verboseError = (logger=console) => async<T>(call: () => Promise<T>) => {
    try {
        const response = await call()
        return response
    } catch (error) {
        new EnhancedError(error).log(logger)
        throw error
    }
}

// mw for fetching the data of the response cause who cares about else
export const dataFetch = async<S, T extends {data:S}>(call: () => Promise<T>) => {
    const response = await call()
    return response.data
}

// mw for retrying a call
export const retry = (amount: number) => async<T>(call: () => Promise<T>) => {
    let currentRetries = 0

    do {
        try {
            const response = await call()
            return response
        } catch (ex) {
            if (currentRetries === amount) {
                throw ex
            }
            ++currentRetries
        }
    } while (currentRetries <= amount) // just for safety
}

// mw for "logout" on 401
export const notAuthToLogout = (logout: () => void | Promise<void>) => async<T>(call: () => Promise<T>)=> {
    try {
        const response = await call()
        return response
    } catch (ex) {
        const status = get(ex, 'response.status')
        if (status !== 401) {
            throw ex
        }
    }

    // k, 401, time login agian
    logout()
    // throw so any waiting promise will be rejected
    throw new Error('logged out')
}

// mw for "refresh" on 401 and then try again
export const notAuthRefresh = (refresh:() => Promise<void>) => async<T>(call: () => Promise<T>) => {
    try {
        const response = await call()
        return response
    } catch (ex) {
        const status = get(ex, 'response.status')
        if (status !== 401) {
            throw ex
        }
    }

    await refresh()
    return call()
}

