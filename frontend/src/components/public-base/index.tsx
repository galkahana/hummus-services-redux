import React from 'react'
import PublicHeader from './public-header'
import PageBase from '@components/page-base'

type PublicBaseProps = {
    children?: React.ReactNode
    title?: string
    subtitle?: string
}

const PublicBase = ({ children, title, subtitle }: PublicBaseProps) => {
    return <PageBase header={<PublicHeader />} title={title} subtitle={subtitle}>{children}</PageBase>
}

export default PublicBase