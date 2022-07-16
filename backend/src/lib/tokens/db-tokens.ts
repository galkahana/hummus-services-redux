import { FilterQuery } from 'mongoose'
import Model from '@models/tokens'
import { IToken, ITokenInput } from '@models/tokens/types'

export const createToken = (data: ITokenInput) => Model.create(data)
export const findByJTI = (jti: string) => Model.findOne({ jti })
export const findAll = (query: FilterQuery<IToken>) => Model.find(query)
export const destroyAll = (query: FilterQuery<IToken>) => Model.deleteMany(query)
export const destroyOne = (query: FilterQuery<IToken>) => Model.deleteOne(query).exec()

export async function createTokenValue(sub: string, data: Omit<ITokenInput, 'sub'|'exp'>, exp?: number) {
    const newToken = await createToken({ sub, exp, ...data })
    return newToken.jti
}

export async function verifyToken(tokenValue: string) {
    const token = await findByJTI(tokenValue)
    if(!token) {
        throw new Error('invalid token')
    }

    if(token.exp && (Date.now() / 1000 > token.exp)) {
        throw new Error('token expired')
    }

    return token.toJSON()
}