import React from 'react'
import auth from 'lib/auth'
import { Navigate } from 'react-router-dom'

const NoMatch = () => {
    if(auth.isLoggedin())
        return <Navigate to="/console" />
    else
        return <Navigate to="/" />
}

export default NoMatch