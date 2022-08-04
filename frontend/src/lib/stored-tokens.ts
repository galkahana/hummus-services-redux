export class StoredTokens {
    _accessToken: Nullable<string> = null
    _refreshToken: Nullable<string> = null

    constructor() {
        this.loadTokens()
    }

    get accessToken() {
        return this._accessToken
    }

    set accessToken(value) {
        this._accessToken = value
        this.persistToken(value, 'accessToken')
    }

    get refreshToken() {
        return this._refreshToken
    }

    set refreshToken(value) {
        this._refreshToken = value
        this.persistToken(value, 'refreshToken')
    }

    clearTokens() {
        this.accessToken = null
        this.refreshToken = null
    }

    private loadTokens() {
        this._accessToken = localStorage.getItem('accessToken')
        this._refreshToken = localStorage.getItem('refreshToken')
    }

    private persistToken(value: Nullable<string>, key: string) {
        if(value == null) {
            localStorage.removeItem(key)
        }
        else {
            localStorage.setItem(key, value)
        }
    }
}


// for now create instance here, later lets think of services strategy

export default new StoredTokens()