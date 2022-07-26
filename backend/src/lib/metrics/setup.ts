import config from 'config'
import { collectDefaultMetrics } from 'prom-client'
import { register, httpRequestTimer } from './instance'

export function setup(){
    collectDefaultMetrics({
        labels: {
            app: config.get<string>('service.name'),
        },
        prefix: 'node_',
        gcDurationBuckets: [ 0.001, 0.01, 0.1, 1, 2, 5 ],
        register
    })

  
    // Register the histogram
    register.registerMetric(httpRequestTimer)    
}

