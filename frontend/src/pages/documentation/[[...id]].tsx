import path from 'path'
import fs from 'fs'

import React, { useEffect, useState } from 'react'
import PublicBase from '@components/public-base'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { GetStaticProps, GetStaticPaths } from 'next'
import { SSRProvider } from 'react-bootstrap'
import Link from 'next/link'

import mustache from '@lib/mustache'
import { siteUrlRoot, apiUrl } from '@lib/urls'
import { useConfig } from '@lib/config'

import { Content } from '@pages-styles/documentation-page.styles'
import MarkdownPage from '@components/markdown-page'

type DocumentationPageProps = {
    content: string
}

const DocumentationPage = ({ content }: DocumentationPageProps) => {
    const [ values, setValues ] = useState<any>({})
    const config = useConfig()


    useEffect(() => {
        setValues({ siteUrlRoot, apiUrl, joinEmail: config?.joinEmail })
    }, [ config ])

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
                            <MarkdownPage content={mustache.render(content, values)} />
                        </div>
                    </Container>
                </Content>
            </PublicBase>
        </SSRProvider>
    )
}

export default DocumentationPage

const PATHES_TO_MDS: { [key: string]: string } = {
    '': 'introduction.md',
    'getting-started': 'getting-started.md',
    'api': 'api-reference.md',
    'api/browser': 'api-reference-browser.md',
    'api/nodejs': 'api-reference-nodejs.md',
    'api/http': 'api-reference-http.md',
    'job-ticket': 'job-ticket.md',
    'job-ticket/boxes': 'hummus-reports/job-ticket-boxes.md',
    'job-ticket/document': 'hummus-reports/job-ticket-document.md',
    'job-ticket/images': 'hummus-reports/job-ticket-images.md',
    'job-ticket/modification': 'hummus-reports/job-ticket-modification.md',
    'job-ticket/pages': 'hummus-reports/job-ticket-pages.md',
    'job-ticket/protection': 'hummus-reports/job-ticket-protection.md',
    'job-ticket/shapes': 'hummus-reports/job-ticket-shapes.md',
    'job-ticket/streams': 'hummus-reports/job-ticket-streams.md',
    'job-ticket/text': 'hummus-reports/job-ticket-text.md',
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.keys(PATHES_TO_MDS).map((key) => ({ params: { id: key.split('/') } }))
    return {
        paths,
        fallback: false
    }
}

const assetsPath = path.resolve(process.cwd(), 'src/assets/mds')

export const getStaticProps: GetStaticProps = async ({ params }) => {
    return {
        props: {
            content: fs.readFileSync(path.resolve(assetsPath, PATHES_TO_MDS[(params?.id as string[] || []).join('/')]), 'utf8')
        }
    }
}