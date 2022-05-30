import 'dotenv/config'
import 'module-alias/register'

import {init as initLog} from '@lib/logger'
import { configure } from '@setup'
import config from 'config'
import express from 'express'
import winston from 'winston'
import { setup as terminatorSetup } from './terminator'

// setup ultimate process killer
terminatorSetup()
// logging init
initLog()


const app = express()

configure(app)
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
 
