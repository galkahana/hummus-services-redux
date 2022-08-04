import { HummusClientTokensProvider, TokensResponse, IUser } from './types'
import axios, { AxiosResponse } from 'axios'
import combine from 'lib/api-helpers/combine'
import { dataFetch, notAuthRefresh, notAuthToLogout, verboseError } from 'lib/api-helpers/api-mws'

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8'
}

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
            `${this.apiUrl}/api/authenticate/sign-in`, 
            null, 
            { headers: { ...this.createUnauthorizedHeaders(), 'Authorization': `Bearer ${refreshToken}` } }
        )
    )

    getMe = this.authMWs(
        () => axios.get<IUser>(`${this.apiUrl}/api/users/me`, { headers: this.createAuthorizedHeaders() })
    )
}



// for now create instance here, later lets think of services strategy

export default new HummusClient(process.env.REACT_APP_API_URL || '')