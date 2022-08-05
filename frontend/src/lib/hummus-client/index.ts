import { HummusClientTokensProvider, TokensResponse, UserResponse, GenerationJobResponse, JobStatus, GetTokensAPIResponse } from './types'
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
        (jobId: string, full: Boolean = false) => axios.get<GenerationJobResponse>(`${this.apiUrl}/api/generation-jobs/${jobId}?full=${full}`, { headers: this.createAuthorizedHeaders() })
    )

    getTokens = this.authMWs(
        () => axios.get<GetTokensAPIResponse>(`${this.apiUrl}/api/tokens`, { headers: this.createAuthorizedHeaders() })
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
                download: this.getPublicGeneratedFileDownloadUrl(generatedFile.publicDownloadId)
            }
        } else {
            return {
                embed: this.getGeneratedFileEmbedUrl(generatedFile.uid),
                download: this.getGeneratedFileDownloadUrl(generatedFile.uid)
            }
        }
    }
}



// for now create instance here, later lets think of services strategy

export default new HummusClient(process.env.REACT_APP_API_URL || '')