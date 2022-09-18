import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Waiting from '@components/waiting/all-screen-waiting'
import authService from '@lib/auth/service'
import { usePrincipal } from '@lib/principal'

type ChildrenProps = {
    children: JSX.Element
}


const ProtectedPage = ({ children }: ChildrenProps) => {
    const router = useRouter()
    const principal = usePrincipal()
    const [ hasIdentity, setHasIdentity ] = useState<Boolean>(principal.hasIdentity())

    useEffect(() => {
        if (!authService.isLoggedin()) {
            router.replace('login', { query: { from: router.pathname } })
            return
        }

        principal.identity().then(
            () => {
                setHasIdentity(true)
            }
        ).catch(
            () => {
                router.replace('login', { query: { from: router.pathname } }) // if this failed...attempt to login again
            }
        )
    }, [ principal, setHasIdentity, router ])

    if (hasIdentity)
        return children
    else
        return <Waiting />
}

export default ProtectedPage