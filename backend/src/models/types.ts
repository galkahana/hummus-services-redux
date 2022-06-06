export enum UserStatus {
    Trial = 'trial',
    Full =  'full'
}


export interface IUser {
    uid: string
    username: string
    email: string
    name?: string
    salt?: string
    hash?: string
    iterations?: number
    status: UserStatus
    createdAt: Date
    updateedAt: Date
  }

export type IUserInput = Omit<IUser, 'uid'|'createdAt'|'updateedAt'>;