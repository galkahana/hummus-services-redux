export interface HummusClientTokensProvider {
    getToken(): string
    refresh(): Promise<void>
    renewLogin(): void | Promise<void>
}


// API responses constructs. might wanna find out a simple way to share with server (that does not neccessarily involve yet another infra)

export type TokensResponse = {
    accessToken: string,
    refreshToken: string
}


export enum UserStatus {
    Trial = 'trial',
    Full =  'full'
}

export type UserResponse = {
    uid: string
    username: string
    email: string
    name?: string
    status: UserStatus
    createdAt: Date
    updatedAt: Date
}

export enum JobStatus {
    JobDone = 0,
    JobInProgress = 1,
    JobFailed = 2
}

export type GenerationJobResponse = {
    uid: string
    status: JobStatus
    label?: string
    ticket: object
    deleteFileAt?: Date
    createdAt: Date
    updatedAt: Date
    generatedFile?: Nullable<GeneratedFileResponse>
    
}

export type GeneratedFileResponse = {
    uid: string
    downloadTitle: string
    publicDownloadId?: string
    fileSize: number
    createdAt: Date
    updatedAt: Date    
}

export type GetTokensAPIResponse = {
    public?: string,
    private?: string
}

export type GenerationJobsQuery = {
    searchTerm?: string
    dateRangeFrom?: string
    dateRangeTo?: string
    in?: string[]
    full?: boolean
}