import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import Waiting from 'components/waiting'
import auth from 'lib/auth'
import history from 'lib/history'
import { usePrincipal } from 'lib/principal'

type ChildrenProps = {
    children: JSX.Element
}


const ProtectedPage = ({ children }: ChildrenProps) => {
    const location = useLocation()
    const principal = usePrincipal()
    const [ hasIdentity, setHasIdentity ] = useState<Boolean>(principal.hasIdentity())


    if(!auth.isLoggedin())
        return <Navigate to="/login" state={{ from: location }} replace />

    principal.identity().then(()=> {setHasIdentity(true)}).catch(()=> {
        history.push('/login') // if this failed...attempt to login again
    })

    if(hasIdentity)
        return children
    else 
        return <Waiting />
}

export default ProtectedPage