import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TransparentLogo from '@assets/logo-transparent-120X120.gif'
import { NiceRedBadge } from '@components/common.styles'

import { TitleLinkContainer } from './site-title.styles'

type SiteTitleProps = {
    href: string
}

const SiteTitle = ({ href }: SiteTitleProps) => (
    <Link href={href} passHref>
        <TitleLinkContainer>
            <span className="logo"><Image  height="60" width="60" src={TransparentLogo.src} alt="hummus-logo" /></span>
            <h1>PDFHummus Services</h1>
            <NiceRedBadge>Beta</NiceRedBadge>
        </TitleLinkContainer>
    </Link>
)


export default SiteTitle