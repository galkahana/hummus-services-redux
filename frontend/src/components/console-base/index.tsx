import React from 'react'
import ConsoleHeader from './console-header'
import PageBase from '@components/page-base'
import ProtectedPage from '@components/protected-page'

type ConsoleBaseProps = {
    children?: React.ReactNode
    title?: string
    subtitle?: string
}

const ConsoleBase = ({ children, title, subtitle }: ConsoleBaseProps) => {
    return <ProtectedPage><PageBase header={<ConsoleHeader />} title={title} subtitle={subtitle}>{children}</PageBase></ProtectedPage>
}

export default ConsoleBase