import React from 'react'
import authService from 'lib/auth/service'
import { Navigate } from 'react-router-dom'

const NoMatch = () => {
    if(authService.isLoggedin())
        return <Navigate to="/console" />
    else
        return <Navigate to="/" />
}

export default NoMatch