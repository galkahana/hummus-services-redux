import { model, Schema } from 'mongoose'
import * as crypto from 'crypto'

import { Roles } from '@lib/authorization/rbac'
import { IToken } from './types'
import { pick } from 'lodash'

const TOKEN_LENGTH = 256

const tokenSchema = new Schema<IToken>({
    jti: {
        type: String,
        required: true,
        unique: true,
        default: function() { return crypto.randomBytes(TOKEN_LENGTH).toString('base64') }
    },
    sub: {
        type: String,
        required: true
    },
    exp: Number,
    role: {
        type:String,
        enum: Roles,
        required:true
    },
    refresh: Boolean
}, {
    timestamps: true
})

tokenSchema.index({ sub: 1, role: 1 })
tokenSchema.index({ jti: 1 }, { unique: true })

const TOKEN_PUBLIC_FIELDS = [ 'sub', 'exp', 'role', 'jti', 'refresh' ] // the keys of TokenPayload
tokenSchema.set('toJSON', { 
    transform: function (doc) {
        return pick(doc, TOKEN_PUBLIC_FIELDS)
    }
})


export default model<IToken>('Token', tokenSchema)
