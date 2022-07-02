import passport from 'passport'
import PassportLocal from 'passport-local'
import  BearerStrategy from 'passport-http-bearer'
import { loginStrategyVerify } from './login-strategy'
import { bearerStrategyVerify} from './bearer-strategy'
import { Providers } from './types'


export function setup() {
    passport.use(Providers.UserPasswordLoginProvider, new PassportLocal.Strategy(loginStrategyVerify))
    passport.use(
        Providers.JwtProvider, new BearerStrategy.Strategy(bearerStrategyVerify)
    )
}
