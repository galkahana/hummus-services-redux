import { AuthResponse } from './types'

export class EnhancedResponse<T> {
    response: AuthResponse<T>

    constructor(response: AuthResponse<T>) {
        this.response = response
    }

    firstInfo() {
        return this.response.locals.info && (Array.isArray(this.response.locals.info) ?  (this.response.locals.info.length > 0 ? this.response.locals.info[0] : undefined) : this.response.locals.info)
    }
}


export function enhanceResponse<T>(response: AuthResponse<T>) {
    return new EnhancedResponse(response)
}