import config from 'config'
import winston, { format } from 'winston'
const { combine, json, printf, timestamp } = format

export function setup() {
    winston.errorEx = (err: Error|unknown, prefix = '') => {
        let pureErrMessage = (err instanceof Error)  ? (err.stack || err.message || err): err
        if (prefix) {
            pureErrMessage = prefix + pureErrMessage
        }
        winston.error(pureErrMessage)
    }
    
    winston.configure({
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ'
            }),
            config.get<string>('logOutput') === 'printf' ?
                printf(
                    info => `[${info.timestamp}, ${info.level}]: ${info.message}`
                ):
                json()
        ),
        transports: [ new winston.transports.Console() ]
    })
}
