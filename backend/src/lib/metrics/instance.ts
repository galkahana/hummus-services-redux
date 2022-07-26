import { Registry, Histogram } from 'prom-client'

export const register = new Registry()

export const httpRequestTimer = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: [ 'method', 'route', 'code' ],
    buckets: [ 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10 ] // 0.1 to 10 seconds
})
