import { checkCaptcha as checkCaptchaLib } from '@lib/google-captcha'
import { NextFunction, Request, Response } from 'express'

export async function checkCaptcha(req: Request, res: Response, next: NextFunction) {
    const captchaResponse = req.headers['hmscpa']
    const result = await checkCaptchaLib(captchaResponse)
    if(!result) {
        // all good
        return next()
    }
    else {
        res.locals.errInfo = result.errInfo
        res.locals.errStatus = result.errStatus
        return next(result.err)
    }

}
