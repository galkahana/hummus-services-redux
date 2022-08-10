import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import {  useNavigate } from 'react-router-dom'

import SiteTitle from 'components/site-title'
import Avatar from 'components/avatar'
import { InlineListItem, PrettyClickableDiv } from 'components/common.styles'
import { HeaderTools, HeaderRoot, HeaderToolsContainer } from 'components/header.styles'
import authService from 'lib/auth/service'

import { Caret } from './console-header.styles'
import { usePrincipal } from 'lib/principal'
import { UserResponse } from 'lib/hummus-client/types'




const ConsoleHeader = () => {
    const navigate = useNavigate()
    const principal = usePrincipal()
    const [ me, setMe ] = useState<Nullable<UserResponse>>(null)

    useEffect(() => {
        principal.identity().then((user)=> {setMe(user)})
    }, [ principal ])    

    const onSignoutClick = (event: React.MouseEvent<HTMLElement>)=> {
        event.preventDefault()
        // and now let's do the signout thing

        authService.signout().catch(()=> {
            console.log('signout failed')
        })
        
        // navigate already now and reset identity. can do two things in par...and i don't mind failing
        principal.setIdentity(null)
        navigate('/')
    }

    return (<HeaderRoot>
        <SiteTitle to="/console"/>
        <HeaderToolsContainer>
            <HeaderTools>
                <InlineListItem><Link to="/console/playground"><button type="button">Playground</button></Link></InlineListItem>
                <InlineListItem><Link to="/console/jobs"><button type="button">Jobs</button></Link></InlineListItem>
                <InlineListItem><Link to="/console/account"><button type="button">Account</button></Link></InlineListItem>
                <InlineListItem><Link to="/documentation"><button type="button">Documentation</button></Link></InlineListItem>
                <InlineListItem><Link to="/contact"><button type="button">Contact us</button></Link></InlineListItem>
            </HeaderTools>
            <Avatar username={me?.email}/>
            <Dropdown align="end">
                <Dropdown.Toggle variant="btn-light" as={Caret}/>
                <Dropdown.Menu>
                    <Dropdown.Header>Logged In As <strong>{me?.username}</strong></Dropdown.Header>
                    <Dropdown.Divider/>
                    <Dropdown.Item><PrettyClickableDiv onClick={onSignoutClick}>Sign Out</PrettyClickableDiv></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </HeaderToolsContainer>

    </HeaderRoot>)   

}

export default ConsoleHeader