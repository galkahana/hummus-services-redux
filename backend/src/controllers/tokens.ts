import { find } from 'lodash'
import { AuthResponse } from '@lib/express/types'
import { Request } from 'express'
import { findAll, destroyAll, createTokenValue } from '@lib/tokens/db-tokens'
import { Roles } from '@lib/authorization/rbac'
import { UserStatus } from '@models/users/types'
import { enhanceResponse } from '@lib/express/enhanced-response'
import { createAccessToken } from '@lib/tokens/site-tokens'


type ShowTokensResponse = {
    public?: string
    private?: string
}

export async function show(req: Request<Record<string, never>, ShowTokensResponse>, res: AuthResponse<ShowTokensResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. shouldnt get here')
    }

    const tokens = await findAll({ sub: user.uid, role: { $in: [ Roles.JobCreator, Roles.JobManager ] } }) // respectively - public api, private api

    res.status(200).json({
        public: find(tokens, { role: Roles.JobCreator })?.jti,
        private: find(tokens, { role: Roles.JobManager })?.jti,
    })
}


type CreateTokenResponse = {
    token: string
}

type CreateTokenBody = {
    role: Roles.JobCreator | Roles.JobManager
}

export async function create(req: Request<Record<string, never>, CreateTokenResponse, CreateTokenBody>, res: AuthResponse<CreateTokenResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }


    if(!req.body.role ||
        (req.body.role !== Roles.JobCreator  &&
            req.body.role !== Roles.JobManager )) {
        return res.badRequest('Missing or invalid token type. should be JobCreator (public api) or JobManager (private api).')
    }

    if(user.status == UserStatus.Trial) {
        return res.badRequest('Trial user is not authorized to create API tokens. Become a full user to create API token')
    }

    const token = await createTokenValue(user.uid, { role: req.body.role })
    return res.status(201).json({ token })
}

enum Actions {
    Revoke = 'revoke',
    Refresh = 'refresh'
}

type ActionsBody = ActionsRevoke | ActionsRefresh 

type ActionsRevoke = {
    type: Actions.Revoke
    role: Roles.JobCreator | Roles.JobManager
}

type ActionsRefresh = {
    type: Actions.Refresh
}


type ActionOK = {
    ok: boolean
}

type ActionRefreshResponse = {
    accessToken: string,
    refreshToken: string
}


type ActionsResponse = ActionOK | ActionRefreshResponse

export async function actions(req: Request<Record<string, never>, ActionsResponse, ActionsBody>, res: AuthResponse<ActionsResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose tokens are being manipulated')
    }
    
    const type = req.body.type
    if(!type) {
        return res.badRequest('Missing type. should be revoke or refresh')
    }
    
    switch(type) {
        case 'revoke': {
            if(!req.body.role ||
                (req.body.role !== Roles.JobCreator  &&
                    req.body.role !== Roles.JobManager )) {
                return res.badRequest('Missing or invalid token type. should be JobCreator (public api) or JobManager (private api).')
            }
            await destroyAll({ sub: user.uid, role:req.body.role })
            res.status(200).json({ ok:true })
            break
        }
        case 'refresh': {
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
            break
        }

        default: {
            res.badRequest('Unknown type. should be revoke or refresh')
        }
    }    
}
