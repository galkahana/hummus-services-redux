import { Roles } from '@lib/authorization/rbac'
import { ObjectId } from 'bson'


export interface IToken {
    _id: ObjectId // internal id
    
    jti: string
    sub: string
    exp?: number
    role: Roles
    refresh?: boolean
    restrictedDomains? : Nullable<string[]>

    createdAt: Date
    updatedAt: Date
  }

export type ITokenInput = Omit<IToken, 'createdAt'|'updatedAt'|'_id'|'jti'>;
