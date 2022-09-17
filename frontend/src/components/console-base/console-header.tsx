import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'

import SiteTitle from '@components/site-title'
import Avatar from '@components/avatar'
import { InlineListItem, PrettyClickableDiv } from '@components/common.styles'
import { HeaderTools, HeaderRoot, HeaderToolsContainer } from '@components/header.styles'
import authService from '@lib/auth/service'

import { Caret } from './console-header.styles'
import { usePrincipal } from '@lib/principal'
import { UserResponse } from '@lib/hummus-client/types'




const ConsoleHeader = () => {
    const router = useRouter()
    const principal = usePrincipal()
    const [ me, setMe ] = useState<Nullable<UserResponse>>(null)

    useEffect(() => {
        principal.identity().then((user) => { setMe(user) })
    }, [ principal ])

    const onSignoutClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        // and now let's do the signout thing

        authService.signout().catch(() => {
            console.log('signout failed')
        })

        // navigate already now and reset identity. can do two things in par...and i don't mind failing
        principal.setIdentity(null)
        router.push('/')
    }

    return (<HeaderRoot>
        <SiteTitle href="/console" />
        <HeaderToolsContainer>
            <HeaderTools>
                <InlineListItem><Link href="/console/playground"><a><button type="button">Playground</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/console/jobs"><a><button type="button">Jobs</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/console/account"><a><button type="button">Account</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/documentation/"><a><button type="button">Documentation</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/contact"><a><button type="button">Contact us</button></a></Link></InlineListItem>
            </HeaderTools>
            <Avatar username={me?.email} />
            <Dropdown align="end">
                <Dropdown.Toggle variant="btn-light" as={Caret} />
                <Dropdown.Menu>
                    <Dropdown.Header>Logged In As <strong>{me?.username}</strong></Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item><PrettyClickableDiv onClick={onSignoutClick}>Sign Out</PrettyClickableDiv></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </HeaderToolsContainer>

    </HeaderRoot>)

}

export default ConsoleHeader