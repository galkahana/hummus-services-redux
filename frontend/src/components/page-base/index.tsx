import React from 'react'

import {
    Wrapper,
    Header,
    Content,
    Footer,
    PageFooter
} from './page-base.styles'

interface PageBaseProps {
    children?: React.ReactNode
    header?: React.ReactNode
}

const PageBase = ({ header, children }: PageBaseProps) => {
    return <Wrapper>
        <Header>
            {header}
        </Header>
        <Content>
            {children}
        </Content>
        <Footer>
            <PageFooter/>
        </Footer>
    </Wrapper>

}

export default PageBase