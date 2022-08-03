import React from 'react'
import TransparentLogo from 'assets/logo-transparent-120X120.gif'
import { NiceRedBadge } from 'components/common.styles'

import { TitleLink } from './site-title.styles'

const SiteTitle = () =>(
    <TitleLink to="/">
        <img src={TransparentLogo} alt="hummus-logo"/>
        <h1>PDFHummus Services</h1>
        <NiceRedBadge>Beta</NiceRedBadge>
    </TitleLink>
)


export default SiteTitle