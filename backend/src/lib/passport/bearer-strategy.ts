import { VerifyFunctionWithRequest } from 'passport-http-bearer'
import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { some } from 'lodash'
import winston from 'winston'

import { verifyJwt } from '@lib/tokens/jwt'
import { findByUID } from '@lib/users'
import { verifyToken } from '@lib/tokens/db-tokens'

import { Providers } from './types'

function getOriginDomain(request: Request) {
    const domainHeaderValue = request.header('Origin') || request.header('Host') || ''
    const originDomain = domainHeaderValue.startsWith('https://') || domainHeaderValue.startsWith('http://') ? new URL(domainHeaderValue).host : domainHeaderValue
    return originDomain
}

export const jwtBearerStrategyVerify: VerifyFunctionWithRequest = async (request: Request, token, done) => {
    try {
        const tokenData: JwtPayload = verifyJwt(token) as JwtPayload
        const domainToRestrict = getOriginDomain(request)

        if(domainToRestrict && tokenData.restrictedDomains && tokenData.restrictedDomains.length > 0 &&
            !some(tokenData.restrictedDomains, (value: string) => value.endsWith(domainToRestrict))) {
            winston.info('Failed domain restriction', {
                domainToRestrict,
                restrictedDomains: tokenData.restrictedDomains
            })
            return done(null, false)
        }
   

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

export const tokenBearerStrategyVerify: VerifyFunctionWithRequest = async (request: Request, token, done) => {
    try {
        const tokenData = await verifyToken(token, getOriginDomain(request) || '')

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