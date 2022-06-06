import { createJwt, jwtTimeIn } from '@lib/jwt'
import config from 'config'
import { Request, Response } from 'express'

/*
    im faking some wait time to throw of potential hackers a bit.
    ok and maybe make my users db seem large :).
    but mainly for the first reason
*/

function _sleep(miliseconds: number) {
    return new Promise((resolve)=> setTimeout(resolve, miliseconds))
}

function _randomSeconds(min: number, max: number) {
    return (min + (max - min)*Math.random())*1000
}

function _waitBadRandomSeconds() {
    return _sleep(_randomSeconds(3,10))
}

function _waitGoodRandomSeconds() {
    return _sleep(_randomSeconds(1,3))
}

function _createAccessJwt(sub: string) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSeconds')))
}

function _createRefreshJwt(sub: string) {
    return createJwt(sub, jwtTimeIn(config.get<number>('jwtToken.maxAgeSecondsRefresh')), {trole: 'ref'})
}

export async function signIn(req: Request, res: Response) {
    const user = req.user
    const info = req.info
    
    if (!user) {
        await _waitBadRandomSeconds()
        return res.unauthenticated('Unauthenticated request')
    }

    const firstInfo = info && (Array.isArray(info) ?  (info.length > 0 ? info[0] : undefined) : info)

    // otherwise generate the token and send back
    await _waitGoodRandomSeconds()
    const access_token = _createAccessJwt(user.uid)
    const refresh_token = _createRefreshJwt(user.uid)
    return res.status(200).json({ access_token, refresh_token, ...firstInfo })
}