import { setup as logSetup } from '@lib/logging/setup'
import { setup as passportSetup } from '@lib/passport/setup'
import { setup as metricsSetup } from '@lib/metrics/setup'
import { generalErrorHandlerSetup, setup as setupMiddlewares } from '@middlewares'
import { setup as routesSetup } from '@routes'
import { Express } from 'express'
import database from './database'
import { setup as terminatorSetup } from './terminator'


export async function setup(app: Express) {
    // setup ultimate process killer
    terminatorSetup()

    metricsSetup()
    
    logSetup()

    passportSetup()
    
    await setupMiddlewares(app)

    routesSetup(app)

    // configured after routes as a general fallback allowing them to just...throw
    generalErrorHandlerSetup(app)

    database.connectTillSuccess()
}
