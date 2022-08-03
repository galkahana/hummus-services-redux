import React from 'react'
import PublicHeader from './public-header'

import {
    Wrapper,
    Header,
    Content,
    Footer,
    PublicFooter
} from './public-base.styles'

interface PublicBaseProps {
    children?: React.ReactNode
}

const PublicBase = ({ children }: PublicBaseProps) => {
    return <Wrapper>
        <Header>
            <PublicHeader/>
        </Header>
        <Content>
            {children}
        </Content>
        <Footer>
            <PublicFooter/>
        </Footer>
    </Wrapper>

}

export default PublicBase