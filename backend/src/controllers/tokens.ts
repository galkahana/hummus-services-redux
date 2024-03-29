import { find } from 'lodash'
import { AuthResponse } from '@lib/express/types'
import { Request } from 'express'
import { findAll, destroyAll, createTokenValue, patchAll } from '@lib/tokens/db-tokens'
import { Roles } from '@lib/authorization/rbac'
import { UserStatus } from '@models/users/types'
import { enhanceResponse } from '@lib/express/enhanced-response'
import { createAccessToken } from '@lib/tokens/site-tokens'

import { OKResponse } from '@middlewares/responses/200'

type TokenData = {
    token: string,
    restrictedDomains?: Nullable<string[]>
}


type ShowTokensResponse = {
    public?:  TokenData
    private?: TokenData
}

export async function show(req: Request<Record<string, never>, ShowTokensResponse>, res: AuthResponse<ShowTokensResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. shouldnt get here')
    }

    const tokens = await findAll({ sub: user.uid, role: { $in: [ Roles.JobCreator, Roles.JobManager ] } }) // respectively - public api, private api

    const publicToken = find(tokens, { role: Roles.JobCreator })
    const privateToken = find(tokens, { role: Roles.JobManager })

    res.status(200).json({
        public: publicToken && {
            token: publicToken.jti,
            restrictedDomains: publicToken.restrictedDomains
        },
        private: privateToken && {
            token: privateToken.jti,
            restrictedDomains: privateToken.restrictedDomains // not really doing this for private tokens...but whatever
        }
    })
}


type CreateTokenResponse = {
    token: string
}

type CreateTokenBody = {
    role: Roles.JobCreator | Roles.JobManager
    restrictedDomains?: Nullable<string[]>
}

export async function create(req: Request<Record<string, never>, CreateTokenResponse, CreateTokenBody>, res: AuthResponse<CreateTokenResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }

    const role = req.body.role
    const restrictedDomains = req.body.restrictedDomains

    if(!role ||
        (role !== Roles.JobCreator  &&
            role !== Roles.JobManager )) {
        return res.badRequest('Missing or invalid token type. should be JobCreator (public api) or JobManager (private api).')
    }

    if(user.status == UserStatus.Trial) {
        return res.badRequest('Trial user is not authorized to create API tokens. Become a full user to create API tokens')
    }

    // destroy existing tokens of the input role
    await destroyAll({ sub: user.uid, role })

    // create new token of the input role
    const token = await createTokenValue(user.uid, { role, restrictedDomains })
    res.status(201).json({ token })
}

type RevokeBody = {
    role: Roles.JobCreator | Roles.JobManager
}

export async function revoke(req: Request<Record<string, never>, OKResponse, RevokeBody>, res: AuthResponse<OKResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }

    if(!req.body.role ||
        (req.body.role !== Roles.JobCreator  &&
            req.body.role !== Roles.JobManager )) {
        return res.badRequest('Missing or invalid token type. should be JobCreator (public api) or JobManager (private api).')
    }
    await destroyAll({ sub: user.uid, role:req.body.role })

    res.ok()
}

type PatchBody = {
    role: Roles.JobCreator | Roles.JobManager,
    restrictedDomains?: Nullable<string[]>
}

export async function patch(req: Request<Record<string, never>, OKResponse, PatchBody>, res: AuthResponse<OKResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }

    if(!req.body.role ||
        (req.body.role !== Roles.JobCreator  &&
            req.body.role !== Roles.JobManager )) {
        return res.badRequest('Missing or invalid token type. should be JobCreator (public api) or JobManager (private api).')
    }
    await patchAll({ sub: user.uid, role:req.body.role }, { restrictedDomains: req.body.restrictedDomains })

    res.ok()
}

type RefreshResponse = {
    accessToken: string,
    refreshToken: string
}

export async function refresh(req: Request<Record<string, never>, RefreshResponse, null>, res: AuthResponse<RefreshResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }

    const isRefresh = enhanceResponse(res).firstInfo()?.tokenData?.refresh
    if(!isRefresh) {
        return res.badRequest('Invalid token')
    }

    const accessToken = createAccessToken(user.uid)
    
    // Refresh returns as well, even though it's unchanged. this is to support future possiblity
    // for updating refresh token on the go
    res.status(200).json({
        accessToken,
        refreshToken: enhanceResponse(res).firstInfo()?.token as string // cant be null at this point
    })    
}