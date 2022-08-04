
import React from 'react'
import hummusClientService from 'lib/hummus-client'
import { IUser } from 'lib/hummus-client/types'

class Principal {
    user?: Nullable<IUser>

    identity = async (force: Boolean = false) => {
        if(!this.user || force) {
            this.user = await hummusClientService.getMe()
        }

        return this.user
    }

    resetIdentity = () => {
        this.user = null
    }

    hasIdentity = () => {
        return !!this.user
    }
}

export const PrincipalContext = React.createContext<Principal>(null!)


export function PrincipalProvider({ children }: { children: React.ReactNode }) {
    const principal = new Principal()
    return <PrincipalContext.Provider value={principal}>{children}</PrincipalContext.Provider>
}
  

export function usePrincipal() {
    return React.useContext(PrincipalContext)
}