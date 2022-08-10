
import React, { useState, useCallback } from 'react'
import hummusClientService from 'lib/hummus-client/service'
import { UserResponse } from 'lib/hummus-client/types'

interface IPrincipal {
    identity: (force?: Boolean) => Promise<Nullable<UserResponse>>
    setIdentity: (user: Nullable<UserResponse>) => void
    hasIdentity: ()=> Boolean
}

export const PrincipalContext = React.createContext<IPrincipal>(null!)


export function PrincipalProvider({ children }: { children: React.ReactNode }) {
    const [ user, setUser ] = useState<Nullable<UserResponse>>(null)

    const identity = useCallback(async (force: Boolean = false) => {
        if(!user || force) {
            const newUser = await hummusClientService.getMe()
            setUser(newUser)
            return newUser
        }
        else {
            return user
        }
    }, [ user ])

    const hasIdentity = useCallback(() => {
        return Boolean(user)
    }, [ user ])

    const setIdentity = useCallback((newUser: Nullable<UserResponse>) => {
        setUser(newUser)
    }, [])

    const principal = {
        identity,
        hasIdentity,
        setIdentity
    }
    return <PrincipalContext.Provider value={principal}>{children}</PrincipalContext.Provider>
}
  

export function usePrincipal() {
    return React.useContext(PrincipalContext)
}