import React from 'react'
import PublicHeader from './public-header'
import PageBase from 'components/page-base'

type ChildrenProps = {
    children?: React.ReactNode
}

const PublicBase = ({ children }: ChildrenProps) => {
    return <PageBase header={<PublicHeader/>}>{children}</PageBase>
}

export default PublicBase