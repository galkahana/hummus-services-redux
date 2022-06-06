import { setup } from '@setup'
import config from 'config'
import express from 'express'
import winston from 'winston'

const app = express()

setup(app)
    .then(() => {
        // Yalla, let's get this party started!
        const port: string = config.get('defaultPort')
        app.set('port',  port)
        app.listen(app.get('port'), () => {
            winston.info(
                `Express server listening on port ${port}`
            )            
        }).on('error', (ex: Error)=> {
            winston.error(
                `Express server failed to listen on port ${port}. ${ex}`
            )
        })
    })
    .catch((ex: Error)  => {
        winston.info(`Server Setup error ${ex}`)
    })