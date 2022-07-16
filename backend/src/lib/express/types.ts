import { IUser } from '@models/users/types'
import { Providers } from '@lib/passport/types'
import { JwtPayload } from 'jsonwebtoken'

import { Response } from 'express'

interface TokenInfo {
    provider: Providers
    tokenData?: JwtPayload
    token?: string
    role?: string
  }

interface AuthLocals extends Record<string, unknown> {
    user?: IUser
    info?: TokenInfo
}
export interface AuthResponse<T> extends Response<T> {
    locals: AuthLocals
}

