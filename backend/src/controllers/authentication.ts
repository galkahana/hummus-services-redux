import { NextFunction, Request } from 'express'

import { enhanceResponse } from '@lib/express/enhanced-response'
import { sleep } from '@lib/async'
import { AuthResponse, TokenInfo } from '@lib/express/types'
import { createAccessToken, createRefreshToken } from '@lib/tokens/site-tokens'
import { destroyOne } from '@lib/tokens/db-tokens'
import { Roles } from '@lib/authorization/rbac'
import winston from 'winston'

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


type SignInTokensResponse = {
    accessToken: string,
    refreshToken: string
}

export async function signIn(_req: Request, res: AuthResponse<SignInTokensResponse&TokenInfo | SignInTokensResponse>) {
    const user = res.locals.user
    
    if (!user) {
        await _waitBadRandomSeconds()
        return res.unauthenticated('Unauthenticated request')
    }

    const firstInfo = enhanceResponse(res).firstInfo()

    // otherwise generate the token and send back
    await _waitGoodRandomSeconds()
    const accessToken = createAccessToken(user.uid)
    const refreshToken = await createRefreshToken(user.uid)
    return res.status(200).json({ accessToken, refreshToken, ...firstInfo })
}

type SignoutBody = {
    refreshToken: string
}

export async function signOut(req:Request<Record<string, never>, Record<string, never>, SignoutBody>, res: AuthResponse, next:NextFunction) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for signing out')
    }    

    // destroy input refresh token...making sure it belongs to the user, and is of the right role
    //try {
    await destroyOne({ jti: req.body.refreshToken, sub: user.uid, role: Roles.SiteUser })
    //} catch(err) {
    //    return next(err)
    //}
    res.sendStatus(204)
}