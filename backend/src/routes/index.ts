import { Express } from 'express'
import api from './api'
import metrics from './metrics'
import web from './web'


export function setup(app: Express) {
    app.use('/api', api)
    app.use('/metrics', metrics)
    app.use('/', web)    
}
