import React from 'react'

import {
    Wrapper,
    Header,
    Content,
    Footer,
    PageFooter
} from './page-base.styles'

import PageTitle from './page-title'

interface PageBaseProps {
    children?: React.ReactNode
    header?: React.ReactNode
    title?: string
    subtitle?: string
}

const PageBase = ({ header, children, title, subtitle }: PageBaseProps) => {
    return <Wrapper>
        <Header>
            {header}
        </Header>
        <Content>
            <PageTitle title={title} subtitle={subtitle}/>
            {children}
        </Content>
        <Footer>
            <PageFooter/>
        </Footer>
    </Wrapper>

}

export default PageBase