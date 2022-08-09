import { ObjectId } from 'bson'

export enum UserStatus {
    Trial = 'trial',
    Full =  'full'
}


export interface IUser {
    _id: ObjectId // internal id
    uid: string // public id
    username: string
    email: string
    name?: string
    salt?: string
    hash?: string
    iterations?: number
    status: UserStatus
    latestFailedLogin?: Nullable<Date>
    createdAt: Date
    updatedAt: Date
  }

export type IUserInput = Omit<IUser, 'uid'|'createdAt'|'updatedAt'|'_id'|'latestFailedLogin'>;