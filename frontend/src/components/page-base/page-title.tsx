import React from 'react'
import Container from 'react-bootstrap/Container'

import { Smaller } from './page-title.styles'

interface PageTitleProps {
    title?: string
    subtitle?: string
}


const PageTitle = ({ title, subtitle } : PageTitleProps) => (
    title ? <Container><h2>{title} { Boolean(subtitle) && <Smaller>{subtitle}</Smaller> }</h2> </Container> : <></>
)

export default PageTitle