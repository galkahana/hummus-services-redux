import styled from 'styled-components'

import { PositionBase, PrettyClickableAnchor } from '@components/common.styles'
import { DEFAULT_BLACK_TRANSPARENT, DEFAULT_BLACK } from '@lib/styles/colors'

export const TitleLinkContainer = styled(PrettyClickableAnchor)`
    ${PositionBase}
    vertical-alignment: center;
    
    .logo {
        float:left;
        margin-right:5px;
    }

    h1 {
        float:left;
        font-size: 20px;
        line-height: 1;
        margin-top:20px;
        margin-right: 2px;
        color: ${DEFAULT_BLACK_TRANSPARENT};
        
        &:hover {
            color: ${DEFAULT_BLACK};
        }
    }

    .nice-red-badge {
        top:10px;
    }
`