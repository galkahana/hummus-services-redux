import uuid from 'node-uuid'
import config from 'config'

import { createJwt, jwtTimeIn } from '@lib/tokens/jwt'
import { Roles } from '@lib/authorization/rbac'
import { createTokenValue } from '@lib/tokens/db-tokens'



export function createAccessToken(sub: string) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSeconds')), { role: Roles.SiteUser, jti: uuid.v1() })
}

export function createRefreshToken(sub: string) {
    return createTokenValue(sub, { role: Roles.SiteUser, refresh: true }, jwtTimeIn(config.get<number>('jwtToken.maxAgeSecondsRefresh')))
}
