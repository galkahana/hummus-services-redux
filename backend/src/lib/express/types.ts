import { Response } from 'express'

import { IUser } from '@models/users/types'
import { Providers } from '@lib/passport/types'
import { TokenPayload } from '@lib/tokens/types'

export interface TokenInfo {
    provider: Providers
    tokenData?: TokenPayload
    token?: string
    role?: string
  }

export interface AuthLocals extends Record<string, unknown> {
    user?: IUser
    info?: TokenInfo|TokenInfo[]
}
export interface AuthResponse<T=unknown> extends Response<T> {
    locals: AuthLocals
}

