import styled from 'styled-components'

import { LIGHT_BACKGROUND_COLOR, LIGHT_BORDER_COLOR } from '@lib/styles/colors'

export const Wrapper = styled.div`
    min-height: 100%;
    position: relative;
`

export const Header = styled.div``


const FOOTER_HEIGHT = '100px'

export const Content = styled.div`
    padding-bottom: ${FOOTER_HEIGHT};
`


export const Footer = styled.div`
    width: 100%;
    height: ${FOOTER_HEIGHT};
    position: absolute;
    bottom: 0;
    left: 0;
`

export const PageFooter = styled.div`
    background-color: ${LIGHT_BACKGROUND_COLOR};
    border-top: 1px solid ${LIGHT_BORDER_COLOR};
    display:block;
    height:100%;
`