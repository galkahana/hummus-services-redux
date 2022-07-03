import { Request } from 'express'

export class EnhancedRequest {
    request: Request

    constructor(request: Request) {
        this.request = request
    }

    firstInfo() {
        return this.request.info && (Array.isArray(this.request.info) ?  (this.request.info.length > 0 ? this.request.info[0] : undefined) : this.request.info)
    }
}


export function enhanceRequest(request: Request) {
    return new EnhancedRequest(request)
}