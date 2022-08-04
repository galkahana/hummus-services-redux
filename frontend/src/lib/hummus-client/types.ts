export interface HummusClientTokensProvider {
    getToken(): string
    refresh(): Promise<void>
    renewLogin(): void | Promise<void>
}

export type TokensResponse = {
    accessToken: string,
    refreshToken: string
}



// User type copied from backend, should pickup some sharing method...yeah yeah client lib...or maybe enjoy this monorepo for a bit
export enum UserStatus {
    Trial = 'trial',
    Full =  'full'
}

export interface IUser {
    uid: string
    username: string
    email: string
    name?: string
    status: UserStatus
    createdAt: Date
    updateedAt: Date
  }
