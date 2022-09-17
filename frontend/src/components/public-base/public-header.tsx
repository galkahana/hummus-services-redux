import React from 'react'

import Link from 'next/link'
import SiteTitle from '@components/site-title'
import { InlineListItem } from '@components/common.styles'

import { HeaderTools, HeaderRoot, HeaderToolsContainer } from '@components/header.styles'


const PublicHeader = () => (
    <HeaderRoot>
        <SiteTitle href="/" />
        <HeaderToolsContainer>
            <HeaderTools>
                <InlineListItem><Link href="/console/"><a><button type="button">Go to console</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/signup"><a><button type="button">Sign Up</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/documentation/"><a><button type="button">Documentation</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/about"><a><button type="button">About</button></a></Link></InlineListItem>
                <InlineListItem><Link href="/contact"><a><button type="button">Contact Us</button></a></Link></InlineListItem>
                <InlineListItem>
                    <a href="http://www.pdfhummus.com"
                        target="_blank" rel="noreferrer">
                        <button type="button">Blog</button>
                    </a>
                </InlineListItem>

            </HeaderTools>
        </HeaderToolsContainer>
    </HeaderRoot>
)


export default PublicHeader