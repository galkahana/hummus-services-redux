import { Handler, Request, Response } from 'express'
import winston from 'winston'

export const logRequest: Handler = (req, res, next) => {
    if (shouldSkip(req)) {
        return next()
    }
    res.locals.startTime = new Date()
    winston.info(`${req.method} ${req.originalUrl}`, { method: req.method, path: req.originalUrl })
    return next()
}

export const logResponse = (req: Request, res: Response) => {
    if (shouldSkip(req))
        return
    const duration= (new Date().getTime() - res.locals.startTime.getTime())/1000.0
    const resource = `${req.method} ${(req.route && req.route.path) ? req.route.path: req.originalUrl}`
    winston.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, { method: req.method, path: req.originalUrl, status: res.statusCode, duration, resource })
}

const shouldSkip = (req: Request) => (req.method === 'OPTIONS')
