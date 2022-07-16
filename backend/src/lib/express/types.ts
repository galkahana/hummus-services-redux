import { IUser } from '@models/users/types'
import { Providers } from '@lib/passport/types'
import { JwtPayload } from 'jsonwebtoken'

import { Response } from 'express'

export interface TokenInfo {
    provider: Providers
    tokenData?: JwtPayload
    token?: string
    role?: string
  }

export interface AuthLocals extends Record<string, unknown> {
    user?: IUser
    info?: TokenInfo|TokenInfo[]
}
export interface AuthResponse<T> extends Response<T> {
    locals: AuthLocals
}

