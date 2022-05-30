import { Express } from 'express'

import api from './api'

export default function(app: Express) {
    app.use('/api', api)
}
