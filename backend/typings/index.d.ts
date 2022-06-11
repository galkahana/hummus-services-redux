import { Provider } from '@middlewares/authentication-providers'
import { IUser } from '@models/users/types'
import 'winston'

declare module 'passport-local' {
  interface IVerifyOptions {
    provider: Provider
  }
}

interface ReqInfo {
  provider: Provider
}

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

    interface Request {
      info?: ReqInfo | ReqInfo[]
      user?: IUser
    }
}

declare module 'winston' {
  export function errorEx(err: Error, prefix?: string) : void
}


