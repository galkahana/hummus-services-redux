import { verifyPassword } from '@lib/passwords'
import { findByUsername } from '@lib/users'
import { VerifyFunction } from 'passport-local'
import { Providers } from './types'


export const loginStrategyVerify : VerifyFunction = async (username, password, done) => {
    try {
        const user = await findByUsername(username)
        if (user && await verifyPassword({
            salt: user.salt || '',
            hash: user.hash || '',
            iterations: user.iterations || 1
            
        },password)) {
            return done(null, user, {provider: Providers.USER_PASSWORD_LOGIN_PROVIDER, message: 'login success'})
        } else {
            return done(null, null)
        }
    } catch (err) {
        return done(null, null)
    }
}