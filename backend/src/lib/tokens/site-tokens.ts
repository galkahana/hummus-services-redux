import { v1 } from 'uuid'
import config from 'config'

import { createJwt, jwtTimeIn } from '@lib/tokens/jwt'
import { Roles } from '@lib/authorization/rbac'
import { createTokenValue } from '@lib/tokens/db-tokens'

const restrictToDomainsConfig = config.get<Nullable<string[]>>('jwtToken.restrictToDomains')
const restrictToDomainEntry = restrictToDomainsConfig ? { restrictedDomains: restrictToDomainsConfig } : {}

export function createAccessToken(sub: string) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSeconds')), { role: Roles.SiteUser, jti: v1(), ...restrictToDomainEntry })
}

export function createRefreshToken(sub: string) {
    return createTokenValue(sub, { role: Roles.SiteUser, refresh: true, ...restrictToDomainEntry }, jwtTimeIn(config.get<number>('jwtToken.maxAgeSecondsRefresh')))
}
