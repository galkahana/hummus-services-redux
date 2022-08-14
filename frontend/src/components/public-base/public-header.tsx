import React from 'react'

import { Link } from 'react-router-dom'
import SiteTitle from 'components/site-title'
import { InlineListItem } from 'components/common.styles'

import { HeaderTools, HeaderRoot, HeaderToolsContainer } from 'components/header.styles'


const PublicHeader = () => (
    <HeaderRoot>
        <SiteTitle to="/"/>
        <HeaderToolsContainer>
            <HeaderTools>
                <InlineListItem><Link to="/console"><button type="button">Go to console</button></Link></InlineListItem>
                <InlineListItem><Link to="/signup"><button type="button">Sign Up</button></Link></InlineListItem>
                <InlineListItem><Link to="/documentation"><button type="button">Documentation</button></Link></InlineListItem>
                <InlineListItem><Link to="/about"><button type="button">About</button></Link></InlineListItem>
                <InlineListItem><Link to="/contact"><button type="button">Contact Us</button></Link></InlineListItem>
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