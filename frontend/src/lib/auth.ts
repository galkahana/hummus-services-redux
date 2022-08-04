
import { AxiosError } from 'axios'
import storedTokensService, { StoredTokens } from './stored-tokens'
import hummusClientService, { HummusClient } from './hummus-client'
import { HummusClientTokensProvider } from './hummus-client/types'
import history from './history'


class Auth implements HummusClientTokensProvider {
    tokens: StoredTokens
    api: HummusClient


    constructor(tokens: StoredTokens, api: HummusClient) {
        this.tokens = tokens
        this.api = api

        this.api.setTokensProvider(this)
    }

    isLoggedin() {
        return this.tokens.accessToken
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

    async signout() {
        if(this.tokens.refreshToken)
            await this.api.signout(this.tokens.refreshToken)
        this.tokens.clearTokens()
    }

    // signup?

    // HummusClientTokensProvider implementation
    
    async refresh()  {
        const { accessToken, refreshToken } = await this.api.refreshToken(this.tokens.refreshToken || '')
        this.tokens.accessToken = accessToken
        this.tokens.refreshToken = refreshToken
    }
    renewLogin(): void | Promise<void> {
        this.tokens.clearTokens()
        history.push('/login') // renewLogin uncharachteristically also navigates...and let's keep it this one instance. 
    }
    getToken(): string {
        return this.tokens.accessToken || ''
    }    
}

// for now create instance here, later lets think of services strategy

const instance = new Auth(storedTokensService, hummusClientService)
hummusClientService.setTokensProvider(instance)
export default instance