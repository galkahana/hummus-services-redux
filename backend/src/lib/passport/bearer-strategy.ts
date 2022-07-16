import { VerifyFunction } from 'passport-http-bearer'
import { verifyJwt } from '@lib/tokens/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { Providers } from './types'
import { findByUID } from '@lib/users'
import { TokenPayload } from '@lib/tokens/types'
import { verifyToken } from '@lib/tokens/db-tokens'


export const jwtBearerStrategyVerify: VerifyFunction = async (token, done) => {
    try {
        const tokenData: JwtPayload = verifyJwt(token) as JwtPayload

        if (!tokenData.sub) {
            return done(null, false)
        }

        const user = await findByUID(tokenData.sub)
        // For now im running with roles and rbac. maybe will change my mind later if i get to providing the user
        // with granular control. at this point i prefer roles, which better hide what can be done with them from an attacker
        return done(null, user, { provider: Providers.JwtProvider, message: 'auth success', tokenData, token, role: tokenData.role || '' }) 
    } catch (err) {
        return done(null, false)
    }
}

export const tokenBearerStrategyVerify: VerifyFunction = async (token, done) => {
    try {
        const tokenData = await verifyToken(token)

        if (!tokenData.sub) {
            return done(null, false)
        }

        const user = await findByUID(tokenData.sub)
        // For now im running with roles and rbac. maybe will change my mind later if i get to providing the user
        // with granular control. at this point i prefer roles, which better hide what can be done with them from an attacker
        return done(null, user, { provider: Providers.TokenProvider, message: 'auth success', tokenData, token, role: tokenData.role || '' }) 
    } catch (err) {
        return done(null, false)
    }    
}