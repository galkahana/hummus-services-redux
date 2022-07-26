import express from 'express'
import * as metricsController from '@controllers/metrics'

const router = express.Router()

router.route('/')
    .get(metricsController.sendMetrics)

export default router