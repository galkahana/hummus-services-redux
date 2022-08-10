import { Handler, Request, Response } from 'express'
import winston from 'winston'

import { httpRequestTimer } from '@lib/metrics/instance'

export const logRequest: Handler = (req, res, next) => {
    if (shouldSkip(req)) {
        return next()
    }
    res.locals.endMetricsTimer = httpRequestTimer.startTimer()

    res.locals.startTime = new Date()
    winston.info(`${req.method} ${req.originalUrl}`, { method: req.method, path: req.originalUrl })
    return next()
}

export const logResponse = (req: Request, res: Response) => {
    if (shouldSkip(req))
        return
    const duration= (new Date().getTime() - res.locals.startTime.getTime())/1000.0
    const resource = `${req.method} ${req.route?.path}`
    // log
    winston.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, { method: req.method, path: req.originalUrl, status: res.statusCode, duration, resource })
    // metrics
    res.locals.endMetricsTimer({ route: req.route?.path, code: res.statusCode, method: req.method })
}

const shouldSkip = (req: Request) => (req.method === 'OPTIONS')
