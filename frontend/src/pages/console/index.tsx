import React from 'react'
import { Container } from 'react-bootstrap'
import Link from 'next/link'

import ConsoleBase from '@components/console-base'
import { UnstyledList, PrettyClickableAnchor } from '@components/common.styles'

import { HomePage } from '../../pages-styles/home.styles'

const Home = () => {
    return <ConsoleBase title="Welcome!">
        <HomePage>
            <Container>
                <div>
                    <h3>Find your way around</h3>
                    <UnstyledList>
                        <li>
                            <Link href="/console/playground" passHref><PrettyClickableAnchor>Design new PDF jobs</PrettyClickableAnchor></Link>
                        </li>
                        <li>
                            <Link href="/console/jobs" passHref><PrettyClickableAnchor>Review jobs history</PrettyClickableAnchor></Link>
                        </li>
                        <li>
                            <Link href="/console/account" passHref><PrettyClickableAnchor>Create API keys and review your account data</PrettyClickableAnchor></Link>
                        </li>
                    </UnstyledList>
                </div>
                <div>
                    <h3>Documentation</h3>
                    <UnstyledList>
                        <li>
                            <Link href="/documentation/getting-started" passHref><PrettyClickableAnchor>Getting Started</PrettyClickableAnchor></Link>
                        </li>
                        <li>
                            <Link href="/documentation/job-ticket/" target="_blank" passHref><PrettyClickableAnchor>Job Ticket Reference</PrettyClickableAnchor></Link>
                        </li>
                        <li>
                            <Link href="/documentation/api/" target="_blank" passHref><PrettyClickableAnchor>Client API Reference</PrettyClickableAnchor></Link>
                        </li>
                    </UnstyledList>
                </div>
            </Container>
        </HomePage>
    </ConsoleBase>
}


export default Home