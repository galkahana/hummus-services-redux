import config from 'config'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export const jwtTimeIn = (seconds: number, fromTS?: number) => {
    const now = moment().unix()
    fromTS = Math.min(fromTS || now, now)
    return fromTS + seconds
}

export const createJwt = (sub: string, exp: number, data?: object) => {
    return jwt.sign({ ...data, sub, exp }, config.get<string>('jwtToken.secret'))
}

export const verifyJwt = (authToken: string) => jwt.verify(authToken, config.get<string>('jwtToken.secret'))
