import passport from 'passport'
import * as passportLocal from 'passport-local'
import { loginStrategyVerify } from './login-strategy'
import { Providers } from './types'


const LocalStrategy = passportLocal.Strategy

export function setup() {
    passport.use(Providers.USER_PASSWORD_LOGIN_PROVIDER, new LocalStrategy(loginStrategyVerify))
}
