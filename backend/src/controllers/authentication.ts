import { createJwt, jwtTimeIn } from '@lib/jwt'
import uuid from 'node-uuid'
import config from 'config'
import { Request, Response } from 'express'
import { enhanceResponse } from '@lib/express/enhanced-response'
import { sleep } from '@lib/async'
import { Roles } from '@lib/authorization/rbac'

/*
    im faking some wait time to throw of potential hackers a bit.
    ok and maybe make my users db seem large :).
    but mainly for the first reason
*/

function _randomSeconds(min: number, max: number) {
    return (min + (max - min)*Math.random())*1000
}

function _waitBadRandomSeconds() {
    return sleep(_randomSeconds(3, 10))
}

function _waitGoodRandomSeconds() {
    return sleep(_randomSeconds(1, 3))
}

type createJwtDataParam = Parameters<typeof createJwt>[2]

function _createAccessJwt(sub: string, data: createJwtDataParam) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSeconds')), data)
}

function _createRefreshJwt(sub: string, data: createJwtDataParam) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSecondsRefresh')), { ...data, trole: 'ref' })
}

export async function signIn(req: Request, res: Response) {
    const user = res.locals.user
    
    if (!user) {
        await _waitBadRandomSeconds()
        return res.unauthenticated('Unauthenticated request')
    }

    const firstInfo = enhanceResponse(res).firstInfo()

    // otherwise generate the token and send back
    await _waitGoodRandomSeconds()
    const access_token = _createAccessJwt(user.uid, { jti: uuid.v1(), role: Roles.SiteUser })
    const refresh_token = _createRefreshJwt(user.uid, { jti: uuid.v1(), role: Roles.SiteUser })
    return res.status(200).json({ access_token, refresh_token, ...firstInfo })
}