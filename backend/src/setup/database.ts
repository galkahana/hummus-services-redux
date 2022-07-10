import config from 'config'
import mongoose from 'mongoose'
import winston from 'winston'

/**
 * This method sanitize the input uri by masking username and password
 * @param uri uri to sanitize
 * @returns String sanitized uri
 */
function _sanitizeURI(uri?: string) {
    if (!uri) {
        return null
    }

    const parts = uri.split('@')
    let sanitizedURI = uri
    if (parts.length === 2) {
        const subParts = parts[0].split('//')
        if (subParts.length === 2) {
            subParts[1] = '********:********'
        }
        sanitizedURI = [ subParts.join('//'), parts[1] ].join('@')
    }
    return sanitizedURI
}    

class Database {
    connected: boolean

    constructor() {
        this.connected = false
    }
    
    connectTillSuccess = (attempts? : number) => 
        new Promise((resolve, reject) => {
            this.connect()
                .then(resolve)
                .catch((err: Error) => {
                    if (attempts === 0) {
                        reject(err)
                    } 
                    else {
                        setTimeout(() => {
                            const newAttempts = attempts == undefined ? attempts : attempts - 1
                            this.connectTillSuccess(newAttempts)
                                .then(resolve)
                                .catch(reject)        
                        }, config.get<number>('db.connectRetryTimeGap'))
                    }
                })
        })

    /**
     * This method establish a connection to the DB. 
     * Uses promise to resolve when connected.
     */
    connect = async () => {
        const uri = config.get<string>('db.connectionString')

        if (!uri) {
            winston.error(
                'Mongoose URI is missing. Please set it and restart the app'
            )
            throw new Error('no uri')
        }

        winston.info(`Connecting to mongodb: ${_sanitizeURI(uri)}`)

        if (mongoose.connection.readyState === 1) {
            winston.info(
                `Already connected to mongodb: ${_sanitizeURI(uri)}`
            )
            this.connected = true
            return
        }

        if (mongoose.connection.readyState !== 0) {
            winston.info(
                'Connecting to mongodb at uri is in illegal state: ' +
                mongoose.connection.readyState
            )
        }
        // connect
        try {
            await mongoose.connect(uri)
            winston.info(`Connected to mongodb: ${_sanitizeURI(uri)}`)
            this.connected = true
        }
        catch(err) {
            winston.error(`Connection failed to mongodb: ${_sanitizeURI(uri)}`)
            if(err instanceof Error)
                winston.errorEx(err)
            throw err
        }
    }

    disconnect = async () => {
        await mongoose.disconnect()
        winston.info('Disconnected from database')
        this.connected = false
    }
}


export default new Database()
