import { configure as configurMiddlewares, configureGeneralErrorHandler } from '@middlewares'
import routes from '@routes'
import { Express } from 'express'

export async function configure(app: Express) {
    await configurMiddlewares(app)
    // routes config
    routes(app)
    // configured after routes as a general fallback allowing them to just...throw
    configureGeneralErrorHandler(app)
    // Database TBD
}

export function isConfigureFinished() {
    true
}
