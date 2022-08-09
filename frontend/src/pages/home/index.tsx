import React from 'react'

import ConsoleBase from 'components/console-base'

import { HomePage } from './home.styles'
import { Container } from 'react-bootstrap'
import { UnstyledList, PrettyClickableLink } from 'components/common.styles'

const Home = () => {
    return <ConsoleBase>
        <HomePage>
            <Container>
                <div>
                    <h3>Find your way around</h3>
                    <UnstyledList>
                        <li>
                            <PrettyClickableLink to='playground'>Design new PDF jobs</PrettyClickableLink>
                        </li>
                        <li>
                            <PrettyClickableLink to='jobs'>Review jobs history</PrettyClickableLink>
                        </li>
                        <li>
                            <PrettyClickableLink to='account'>Create API keys and review your account data</PrettyClickableLink>
                        </li>
                    </UnstyledList>
                </div>
                <div>
                    <h3>Documentation</h3>
                    <UnstyledList>
                        <li>
                            <PrettyClickableLink to="/documentation/getting-started">Getting Started</PrettyClickableLink>
                        </li>
                        <li>
                            <PrettyClickableLink to="/documentation/job-ticket" target="_blank">Job Ticket Reference</PrettyClickableLink>
                        </li>
                        <li>
                            <PrettyClickableLink to="/documentation/api" target="_blank">Client API Reference</PrettyClickableLink>
                        </li>
                    </UnstyledList>
                </div>
            </Container>
        </HomePage>
    </ConsoleBase>
}


export default Home