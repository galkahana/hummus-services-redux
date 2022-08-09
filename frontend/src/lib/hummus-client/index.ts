import { 
    HummusClientTokensProvider, 
    TokensResponse, 
    UserResponse, 
    GenerationJobResponse, 
    JobStatus, 
    TokensAPIResponse, 
    GenerationJobsQuery, 
    UserPatchInput,
    ResponseOK,
    CreateTokenAPIResponse,
    PlanUsageQuery,
    PlanUsageResult
} from './types'
import axios, { AxiosResponse } from 'axios'
import combine from 'lib/api-helpers/combine'
import { dataFetch, notAuthRefresh, notAuthToLogout, verboseError } from 'lib/api-helpers/api-mws'
import { sleep } from 'lib/async'

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8'
}

const JOB_STATUS_CHECK_PERIOD = 1000

type MWWithDataFetch = <Args extends any[], S>(call: (...operationParameters: Args) => Promise<AxiosResponse<S>>) => (...operationParameters: Args) => Promise<S>

const unauthMWs: MWWithDataFetch = combine(verboseError(), dataFetch)

const refresh = (self: HummusClient) => async () => {
    await self.tokensProvider?.refresh()
}

const renewLogin = (self: HummusClient) => () => {
    self.tokensProvider?.renewLogin()
}

export class HummusClient {
    apiUrl: string
    tokensProvider?: HummusClientTokensProvider
    authMWs: MWWithDataFetch = combine(
        verboseError(),
        dataFetch,
        notAuthToLogout(renewLogin(this)),
        notAuthRefresh(refresh(this))
    )

    constructor(apiUrl: string, tokensProvider?: HummusClientTokensProvider) {
        this.apiUrl = apiUrl
        this.tokensProvider = tokensProvider
    }

    private createUnauthorizedHeaders() {
        return HEADERS
    }

    private createAuthorizedHeaders() {
        return {
            ...HEADERS,
            'Authorization': `Bearer ${this.tokensProvider?.getToken()}`
        }
    }

    setTokensProvider(tokensProvider?: HummusClientTokensProvider) {
        this.tokensProvider = tokensProvider
    }

    signin = unauthMWs(
        (username: string, password: string) => axios.post<TokensResponse>(
            `${this.apiUrl}/api/authenticate/sign-in`, 
            { username, password }, 
            { headers: this.createUnauthorizedHeaders() }
        )
    )

    signout = this.authMWs(
        (refreshToken: string) => axios.delete(
            `${this.apiUrl}/api/authenticate/sign-out`, 
            { data: { refreshToken }, headers: this.createAuthorizedHeaders() }
        )
    )

    signup = this.authMWs(
        (username: string, email: string, password: string, captcha: string) => axios.post<TokensResponse>(
            `${this.apiUrl}/api/authenticate/sign-up`,
            {
                username,
                email,
                password
            },
            { headers: {
                ...this.createUnauthorizedHeaders(),
                hmscpa: captcha
            } }
        )
    )

    refreshToken = unauthMWs(
        (refreshToken: string) => axios.post<TokensResponse>(
            `${this.apiUrl}/api/tokens/refresh`, 
            null, 
            { headers: { ...this.createUnauthorizedHeaders(), 'Authorization': `Bearer ${refreshToken}` } }
        )
    )

    getMe = this.authMWs(
        () => axios.get<UserResponse>(`${this.apiUrl}/api/users/me`, { headers: this.createAuthorizedHeaders() })
    )

    patchMe = this.authMWs(
        (userUpdate: UserPatchInput) => axios.patch<UserResponse>(`${this.apiUrl}/api/users/me`, userUpdate, { headers: this.createAuthorizedHeaders() })
    )


    idUrl = (url: string) => {
        const accessToken = this.tokensProvider?.getToken()
        // bearer parameter - https://github.com/jaredhanson/passport-http-bearer#issuing-tokens
        return `${url}${accessToken ? ('?access_token=' + accessToken):''}`
    }   

    getGeneratedFileDownloadUrl = (generatedFileId: string) => {
        return this.idUrl(`${this.apiUrl}/api/generated-files/${generatedFileId}/download`)
    }

    getGeneratedFileEmbedUrl = (generatedFileId: string) => {
        return this.idUrl(`${this.apiUrl}/api/generated-files/${generatedFileId}/embed`)
    }

    getPublicGeneratedFileDownloadUrl = (publicDownloadId: string) => {
        return `${this.apiUrl}/api/public/${publicDownloadId}/download`
    }

    getPublicGeneratedFileEmbedUrl = (publicDownloadId: string) => {
        return `${this.apiUrl}/api/public/${publicDownloadId}/embed`
    }


    createJob = this.authMWs(
        (ticket: object) => axios.post<GenerationJobResponse>(`${this.apiUrl}/api/generation-jobs`, ticket, { headers: this.createAuthorizedHeaders() })
    )

    getJob = this.authMWs(
        (jobId: string, full: Boolean = false) => axios.get<GenerationJobResponse>(`${this.apiUrl}/api/generation-jobs/${jobId}`, { params:{ full }, headers: this.createAuthorizedHeaders() })
    )

    getTokens = this.authMWs(
        () => axios.get<TokensAPIResponse>(`${this.apiUrl}/api/tokens`, { headers: this.createAuthorizedHeaders() })
    )

    createPrivateAPIToken = this.authMWs(
        () => axios.post<CreateTokenAPIResponse>(`${this.apiUrl}/api/tokens`, { 'role': 'JobManager' }, { headers: this.createAuthorizedHeaders() })
    )

    createPublicAPIToken = this.authMWs(
        () => axios.post<CreateTokenAPIResponse>(`${this.apiUrl}/api/tokens`, { 'role': 'JobCreator' }, { headers: this.createAuthorizedHeaders() })
    )

    deletePrivateAPIToken = this.authMWs(
        () => axios.post<ResponseOK>(`${this.apiUrl}/api/tokens/revoke`, { 'role': 'JobManager' }, { headers: this.createAuthorizedHeaders() })
    )

    deletePublicAPIToken = this.authMWs(
        () => axios.post<ResponseOK>(`${this.apiUrl}/api/tokens/revoke`, { 'role': 'JobCreator' }, { headers: this.createAuthorizedHeaders() })
    )


    getJobs = this.authMWs(
        (params: GenerationJobsQuery) => axios.get<GenerationJobResponse[]>(`${this.apiUrl}/api/generation-jobs`, { params,  headers: this.createAuthorizedHeaders() })
    )

    deleteFilesForJobs = this.authMWs(
        (jobIDs: string[]) => axios.post<ResponseOK>(`${this.apiUrl}/api/generation-jobs/delete-files`, { items: jobIDs }, { headers: this.createAuthorizedHeaders() })
    )
        
    deleteJobs = this.authMWs(
        (jobIDs: string[]) => axios.post<ResponseOK>(`${this.apiUrl}/api/generation-jobs/delete-jobs`, { items: jobIDs }, { headers: this.createAuthorizedHeaders() })
    )

    getUserPlanUsage = this.authMWs(
        (params: PlanUsageQuery) => axios.get<PlanUsageResult>(`${this.apiUrl}/api/users/me/plan-usage`, { params,  headers: this.createAuthorizedHeaders() })
    )

    changeUsername = this.authMWs(
        (username: string) => axios.post<ResponseOK>(`${this.apiUrl}/api/users/me/change-username`, { username }, { headers: this.createAuthorizedHeaders() })
    )

    changePassword = this.authMWs(
        (oldPassword: string, newPassword) => axios.post<ResponseOK>(`${this.apiUrl}/api/users/me/change-password`, { oldPassword, newPassword }, { headers: this.createAuthorizedHeaders() })
    )    

    async generatePDFDocument(ticket: object) { // at some point i'll want to type it more seriously...i do have this useful definition in the backend after all
        let generationJob = await this.createJob(ticket)

        while(generationJob.status === JobStatus.JobInProgress) {
            await sleep(JOB_STATUS_CHECK_PERIOD)
            generationJob = await this.getJob(generationJob.uid, true)
        }

        if(generationJob.status === JobStatus.JobFailed || !generationJob.generatedFile) {
            throw Error('Job failed (and there\'s probably a good explanation somewhere)')
        }

        const generatedFile = generationJob.generatedFile
        if(generatedFile.publicDownloadId) {
            // just for kicks, use public url if the file is public. otherwise use download with active access token
            return {
                embed: this.getPublicGeneratedFileEmbedUrl(generatedFile.publicDownloadId),
                download: this.getPublicGeneratedFileDownloadUrl(generatedFile.publicDownloadId),
                jobData: generationJob
            }
        } else {
            return {
                embed: this.getGeneratedFileEmbedUrl(generatedFile.uid),
                download: this.getGeneratedFileDownloadUrl(generatedFile.uid),
                jobData: generationJob
            }
        }
    }
}



// for now create instance here, later lets think of services strategy

export default new HummusClient(process.env.REACT_APP_API_URL || '')