import { Provider } from '@middlewares/authentication-providers'
import { IUser } from '@models/users/types'
import { JwtPayload } from 'jsonwebtoken'
import 'winston'

declare module 'passport-local' {
  interface IVerifyOptions {
    provider: Provider
  }
}

declare module 'passport-http-bearer' {
  interface IVerifyOptions {
    provider: Provider
    tokenData: JwtPayload
    token: string
    role: string
    scope?: string | Array[string] // overriding, making it optional to allow using "role" which is what i want
  }
}

interface ReqInfo {
  provider: Provider
  tokenData?: JwtPayload
  token?: string
  role?: string
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
  export function errorEx(err: Error|unknown, prefix?: string) : void
}


