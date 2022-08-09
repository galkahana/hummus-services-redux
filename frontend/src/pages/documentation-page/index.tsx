import React from 'react'
import PublicBase from 'components/public-base'
import { Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { Content } from './documentation-page.styles'
import { siteUrlRoot, apiUrl } from 'lib/urls'

const DocumentationPage = () => {
    return (
        <PublicBase>
            <Content>
                <Container>
                    <Navbar expand="sm" className="documentation-nav-bar">
                        <Navbar.Brand>Table Of Contents</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav>
                                <Nav.Link href="/documentation">Introduction</Nav.Link>
                                <Nav.Link href="/documentation/getting-started">Getting Started</Nav.Link>
                                <Nav.Link href="/documentation/api">API Reference</Nav.Link>
                                <NavDropdown title="" className="api-dropdown">
                                    <Nav.Link href="/documentation/api/browser">Browser</Nav.Link>
                                    <Nav.Link href="/documentation/api/nodejs">NodeJS</Nav.Link>
                                    <Nav.Link href="/documentation/api/http">HTTP</Nav.Link>
                                </NavDropdown>
                                <Nav.Link href="/documentation/job-ticket">Job Ticket Reference</Nav.Link>
                                <NavDropdown title="" className="job-ticket-dropdown">
                                    <Nav.Link href="/documentation/job-ticket/document">Document</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/pages">Pages</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/boxes">Boxes</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/text">Text</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/shapes">Shapes</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/images">Images</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/streams">Streams</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/protection">Password Protection</Nav.Link>
                                    <Nav.Link href="/documentation/job-ticket/modification">Modify Existing PDFs</Nav.Link>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    
                    </Navbar>
                    <div className="documentation-content">
                        <Outlet context={{ values:{ siteUrlRoot, apiUrl } }}/>
                    </div>
                </Container>
            </Content>
        </PublicBase>
    )
}

export default DocumentationPage

