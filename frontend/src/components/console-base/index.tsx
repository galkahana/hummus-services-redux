import React from 'react'
import ConsoleHeader from './console-header'
import PageBase from 'components/page-base'

type ConsoleBaseProps = {
    children?: React.ReactNode
    title?: string
    subtitle?: string
}

const ConsoleBase = ({ children, title, subtitle }: ConsoleBaseProps) => {
    return <PageBase header={<ConsoleHeader/>} title={title} subtitle={subtitle}>{children}</PageBase>
}

export default ConsoleBase