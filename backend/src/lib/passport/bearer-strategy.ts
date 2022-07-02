import { VerifyFunction } from 'passport-http-bearer'
import { verifyJwt } from '@lib/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { Providers } from './types'
import { findByUID } from '@lib/users'


export const bearerStrategyVerify: VerifyFunction = async (accessToken, done) => {
    try {
        const jwtDecoded: JwtPayload = verifyJwt(accessToken) as JwtPayload

        if (!jwtDecoded.sub) {
            return done(null, false)
        }

        const user = await findByUID(jwtDecoded.sub)
        // For now im running with roles and rbac. maybe will change my mind later if i get to providing the user
        // with granular control. at this point i prefer roles, which better hide what can be done with them from an attacker
        return done(null, user, {provider: Providers.JwtProvider, message: 'auth success', jwtDecoded, role: jwtDecoded.role || ''}) 
    } catch (err) {
        return done(null, false)
    }
}