import { InlineList } from '@components/common.styles'
import styled from 'styled-components'

import { DEFAULT_BLACK_TRANSPARENT, DEFAULT_BLACK, LIGHT_BACKGROUND_COLOR, LIGHT_BORDER_COLOR } from '@lib/styles/colors'

export const HeaderRoot = styled.div.attrs({ className: 'clearfix' })`
    background-color: ${LIGHT_BACKGROUND_COLOR};
    border-bottom: 1px solid ${LIGHT_BORDER_COLOR};
    display:block;
    padding-bottom:5px;    
`

export const HeaderToolsContainer = styled.div`
    float:right;
            
    >* {
        display:inline-block;
        vertical-align: middle;
    }

`

export const HeaderTools = styled(InlineList)`
    margin-top: 18px;
    margin-right: 30px;

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
