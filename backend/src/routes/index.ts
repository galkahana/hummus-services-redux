import { Express } from 'express'
import api from './api'
import metrics from './metrics'


export function setup(app: Express) {
    app.use('/api', api)
    app.use('/metrics', metrics)
}
