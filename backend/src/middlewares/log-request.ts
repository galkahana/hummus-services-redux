import { Handler, Request, Response } from 'express'
import winston from 'winston'

export const logRequest: Handler = (req, _res, next) => {
    if (shouldSkip(req)) {
        return next()
    }
    winston.info(`${req.method} ${req.originalUrl}`)
    return next()
}

export const logResponse = (req: Request, res: Response) => {
    if (shouldSkip(req))
        return
    winston.info(`${req.method} ${req.originalUrl} ${res.statusCode}`)
}

const shouldSkip = (req: Request) => (req.method === 'OPTIONS')
