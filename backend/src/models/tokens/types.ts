import { Roles } from '@lib/authorization/rbac'
import { ObjectId } from 'bson'


export interface IToken {
    _id: ObjectId // internal id
    
    jti: string
    sub: string
    exp?: number
    role: Roles
    refresh?: boolean

    createdAt: Date
    updateedAt: Date
  }

export type ITokenInput = Omit<IToken, 'createdAt'|'updateedAt'|'_id'|'jti'>;
