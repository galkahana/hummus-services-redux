import Router from 'next/router'

import { StoredTokens } from '../stored-tokens'
import { HummusClient } from '../hummus-client'
import { HummusClientTokensProvider } from '../hummus-client/types'

export class Auth implements HummusClientTokensProvider {
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

    async signin(username: string, password: string, captcha?: string) {
        const { accessToken, refreshToken } = await this.api.signin(username, password, captcha)
        this.tokens.accessToken = accessToken
        this.tokens.refreshToken = refreshToken
    }

    async signout() {
        if (this.tokens.refreshToken)
            await this.api.signout(this.tokens.refreshToken)
        this.tokens.clearTokens()
    }

    async signup(username: string, email: string, password: string, captcha?: string) {
        const { accessToken, refreshToken } = await this.api.signup(username, email, password, captcha)
        this.tokens.accessToken = accessToken
        this.tokens.refreshToken = refreshToken
    }

    // HummusClientTokensProvider implementation

    async refresh() {
        const { accessToken, refreshToken } = await this.api.refreshToken(this.tokens.refreshToken || '')
        this.tokens.accessToken = accessToken
        this.tokens.refreshToken = refreshToken
    }
    renewLogin(): void | Promise<void> {
        this.tokens.clearTokens()
        Router.push('/login') // renewLogin uncharachteristically also navigates...and let's keep it this one instance. 
    }
    getToken(): string {
        return this.tokens.accessToken || ''
    }
}

