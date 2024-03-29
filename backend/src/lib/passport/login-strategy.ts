import { verifyPassword } from '@lib/passwords'
import { findByUsername } from '@lib/users'
import { VerifyFunction } from 'passport-local'
import { Providers } from './types'


export const loginStrategyVerify : VerifyFunction = async (username, password, done) => {
    try {
        const user = await findByUsername(username)
        if (user && await verifyPassword({
            salt: user.salt,
            hash: user.hash,
            iterations: user.iterations
            
        }, password)) {
            return done(null, user, { provider: Providers.UserPasswordLoginProvider, message: 'login success' })
        } else {
            return done(null, null)
        }
    } catch (err) {
        return done(null, null)
    }
}