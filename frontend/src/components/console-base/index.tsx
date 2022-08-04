import React from 'react'
import ConsoleHeader from './console-header'
import PageBase from 'components/page-base'

type ChildrenProps = {
    children?: React.ReactNode
}

const ConsoleBase = ({ children }: ChildrenProps) => {
    return <PageBase header={<ConsoleHeader/>}>{children}</PageBase>
}

export default ConsoleBase