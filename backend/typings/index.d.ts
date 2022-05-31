import 'winston'

/**
 * Type extensions
 */

declare module 'express-serve-static-core' {
    interface Response {
        badRequest: (message?: string) => void
        forbidden: (message?: string) => void
        unauthenticated: (message?: string) => void
        notFound: (message?: string) => void
        unprocessable: (message?: string) => void
        serverError: (message?: string) => void

        errStatus?: number
    }
}

declare module 'winston' {
  export function errorEx(err: Error, prefix: string) : void
}