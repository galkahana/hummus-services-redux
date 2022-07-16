import { Providers } from '@lib/passport/types'
import { JwtPayload } from 'jsonwebtoken'
import 'winston'

declare module 'passport-local' {
  interface IVerifyOptions {
    provider: Providers
  }
}

declare module 'passport-http-bearer' {
  interface IVerifyOptions {
    provider: Providers
    tokenData: JwtPayload
    token: string
    role: string
    scope?: string | Array[string] // overriding, making it optional to allow using "role" which is what i want
  }
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
  }
}

declare module 'winston' {
  export function errorEx(err: Error | unknown, prefix?: string): void
}


