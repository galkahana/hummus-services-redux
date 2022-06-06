import { Providers } from '@lib/passport/types'
import { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import passport from 'passport'



function _authenticateWithProviders(...rest: Providers[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        // The array provided here holds 1 or more possible providers.
        // Where makes sense.
        passport.authenticate([...rest], { session: false }, function(
            err,
            user,
            info
        ) {
            if (err) {
                return next(err)
            }

            // on success info will be the one from the provider that succeeded
            // on failure info will be array of all providers infos
            req.user = user
            req.info = info

            return next()
        })(req, res, next)
    }
}



export const login = [
    body('username').escape(),
    _authenticateWithProviders(
        Providers.USER_PASSWORD_LOGIN_PROVIDER
    )
]
