import { InlineList } from 'components/common.styles'
import styled from 'styled-components'

import { DEFAULT_BLACK_TRANSPARENT, DEFAULT_BLACK } from 'lib/styles/colors'
import { LIGHT_BACKGROUND_COLOR, LIGHT_BORDER_COLOR } from './shared.styles'

export const PublicHeaderRoot = styled.div.attrs({ className: 'clearfix' })`
    background-color: ${LIGHT_BACKGROUND_COLOR};
    border-bottom: 1px solid ${LIGHT_BORDER_COLOR};
    display:block;
    padding-bottom:5px;    
`

export const HeaderTools = styled(InlineList)`
    float:right;
    margin: 18px 30px 0 0;

    button {
        background: rgba(0,0,0,0.05);
        color: ${DEFAULT_BLACK_TRANSPARENT};
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        border-radius: 20px;
        border:0;
        outline:none;
        
        &:hover {
            color: ${DEFAULT_BLACK};
        }            
    }

`

export const HeaderTool = styled.li.attrs({
    className : 'list-inline-item'
})``