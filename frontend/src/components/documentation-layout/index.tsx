import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { SSRProvider } from 'react-bootstrap'
import Link from 'next/link'

import PublicBase from '@components/public-base'

import { Content } from './documentation-layout.styles'


export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
    return (
        <SSRProvider>
            <PublicBase>
                <Content>
                    <Container>
                        <Navbar expand="sm" className="documentation-nav-bar">
                            <Navbar.Brand>Table Of Contents</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav>
                                    <Link href="/documentation/" passHref><Nav.Link>Introduction</Nav.Link></Link>
                                    <Link href="/documentation/getting-started/" passHref><Nav.Link>Getting Started</Nav.Link></Link>
                                    <Link href="/documentation/api/" passHref><Nav.Link>API Reference</Nav.Link></Link>
                                    <NavDropdown title="" className="api-dropdown">
                                        <Link href="/documentation/api/browser/" passHref><Nav.Link>Browser</Nav.Link></Link>
                                        <Link href="/documentation/api/nodejs/" passHref><Nav.Link>NodeJS</Nav.Link></Link>
                                        <Link href="/documentation/api/http/" passHref><Nav.Link>HTTP</Nav.Link></Link>
                                    </NavDropdown>
                                    <Link href="/documentation/job-ticket/" passHref><Nav.Link>Job Ticket Reference</Nav.Link></Link>
                                    <NavDropdown title="" className="job-ticket-dropdown">
                                        <Link href="/documentation/job-ticket/document/" passHref><Nav.Link>Document</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/pages/" passHref><Nav.Link>Pages</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/boxes/" passHref><Nav.Link>Boxes</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/text/" passHref><Nav.Link>Text</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/shapes/" passHref><Nav.Link>Shapes</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/images/" passHref><Nav.Link>Images</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/streams/" passHref><Nav.Link>Streams</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/protection/" passHref><Nav.Link>Password Protection</Nav.Link></Link>
                                        <Link href="/documentation/job-ticket/modification/" passHref><Nav.Link>Modify Existing PDFs</Nav.Link></Link>
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>

                        </Navbar>
                        <div className="documentation-content">
                            <div className="markdown-page">
                                {children}
                            </div>                            
                        </div>
                    </Container>
                </Content>
            </PublicBase>
        </SSRProvider>
    )
}
