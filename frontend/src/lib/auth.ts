
import storedTokensService, { StoredTokens } from './stored-tokens'
import hummusClientService, { HummusClient } from './hummus-client'
import { HummusClientTokensProvider } from './hummus-client/types'
import { AxiosError } from 'axios'


class Auth implements HummusClientTokensProvider {
    tokens: StoredTokens
    api: HummusClient


    constructor(tokens: StoredTokens, api: HummusClient) {
        this.tokens = tokens
        this.api = api

        this.api.setTokensProvider(this)
    }

    async signin(username: string, password: string) {
        try {
            const { accessToken, refreshToken } = await this.api.signin(username, password)
            this.tokens.accessToken = accessToken
            this.tokens.refreshToken = refreshToken
        } catch (ex: unknown) {
            if (ex instanceof AxiosError) {
                if(ex.response?.status === 401)
                    throw Error('Incorrect Credentials, please correct the login information and try again')
                throw Error('Connection error, please try again')
            }
            else {
                throw Error('Unkown Error')
            }
        }
    }

    // signout

    // signup

    // HummusClientTokensProvider implementation
    // getToken
    // refreshToken
    // onInvalidToken
}

// for now create instance here, later lets think of services strategy

export default new Auth(storedTokensService, hummusClientService)