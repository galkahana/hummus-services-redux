import { Request, Response } from 'express'
import { register } from '@lib/metrics/instance'

export async function sendMetrics(_: Request, res: Response) {
    res.setHeader('Content-Type', register.contentType)
    res.send(await register.metrics())
}