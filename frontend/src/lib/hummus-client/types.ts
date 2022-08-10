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

export type UserPatchInput = {
    email?: string
    name?: string
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
    finishedAt?: Date
    createdAt: Date
    updatedAt: Date
    generatedFile?: string
    generatedFileObject?: Nullable<GeneratedFileResponse>
    
}

export type GeneratedFileResponse = {
    uid: string
    downloadTitle: string
    publicDownloadId?: string
    fileSize: number
    createdAt: Date
    updatedAt: Date    
}

export type TokensAPIResponse = {
    public?: string,
    private?: string
}

export type CreateTokenAPIResponse = {
    token: string
}

export type GenerationJobsQuery = {
    searchTerm?: string
    dateRangeFrom?: string
    dateRangeTo?: string
    in?: string[]
    full?: boolean
}

export type ResponseOK = {
    ok: Boolean
}

export type PlanUsageQuery = {
    to?: string
    from?: string
}

export type PlanUsageResult = {
    generation: {size: number, count: number},
    download: {size: number, count: number},
    totalStorageSize: number,
    from: Date,
    to: Date
}