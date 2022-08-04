import { HummusClientTokensProvider, SigninResponse } from './types'
import axios, { AxiosResponse } from 'axios'
import combine from 'lib/api-helpers/combine'
import { dataFetch, verboseError } from 'lib/api-helpers/api-mws'

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8'
}

type MWWithDataFetch = <Args extends any[], S>(call: (...operationParameters: Args) => Promise<AxiosResponse<S>>) => (...operationParameters: Args) => Promise<S>

const unauthMWs: MWWithDataFetch = combine(verboseError(), dataFetch)

export class HummusClient {
    apiUrl: string
    tokensProvider?: HummusClientTokensProvider

    constructor(apiUrl: string, tokensProvider?: HummusClientTokensProvider) {
        this.apiUrl = apiUrl
        this.tokensProvider = tokensProvider
    }

    setTokensProvider(tokensProvider?: HummusClientTokensProvider) {
        this.tokensProvider = tokensProvider
    }

    signin = unauthMWs(
        (username: string, password: string) => axios.post<SigninResponse>(`${this.apiUrl}/api/authenticate/sign-in`, { username, password }, { headers: HEADERS })
    )
    
}



// for now create instance here, later lets think of services strategy

export default new HummusClient(process.env.REACT_APP_API_URL || '')