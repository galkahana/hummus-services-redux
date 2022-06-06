import bodyParser from 'body-parser'
import config from 'config'
import cors from 'cors'
import { ErrorRequestHandler, Express } from 'express'
import _fs from 'fs'
import path from 'path'
import { logRequest, logResponse } from './log-request'

const fs = _fs.promises

export async function setup(app: Express) {
    // body parsing
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(cors({
        origin: '*',
        methods: 'GET,PUT,POST,DELETE',
        allowedHeaders: 'access-control-allow-origin, accept, content-type, Authorization, hmscpa'
    }))

    // log entry
    app.use(logRequest)

    // metrics for entry
    app.use((req, res, next) => {
        res.on('finish', function () {
            logResponse(req, res)
        })
        next()
    })

    // configure convenience methods for sending back error responses for statuses
    await _configureResponses(app)
}

export function generalErrorHandlerSetup(app: Express) {
    // general purposes exception catcher middleware
    // eslint-disable-next-line no-unused-vars
    app.use(_generalErrorHandler)
}

const _generalErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(res.errStatus || 500)

    // development error handler - will print stacktrace
    // production error handler - no stacktraces leaked to user
    const errData = config.get<boolean>('isDebug') ? err : {}

    res.format({
        text: () => {
            res.send(err.message)
        },
        json: () => {
            res.json({
                message: err.message,
                error: errData,
                info: err.info
            })
        }
    })
}

const _configureResponses = async (app: Express) => {
    const responsesDirName = path.resolve(__dirname, './responses')
    const dirFiles = await fs.readdir(responsesDirName)
    for (const filename of dirFiles) {
        const extension = path.extname(filename)
        if (extension == '.ts' || extension == '.js') {
            const module = await import(`${responsesDirName}/${filename}`)
            app.use(module.default)
        }
    }
}

