import { Express } from 'express'
import api from './api'


export function setup(app: Express) {
    app.use('/api', api)
}
