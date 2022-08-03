import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { PositionBase, NoUnderlineEver } from 'components/common.styles'
import { DEFAULT_BLACK_TRANSPARENT, DEFAULT_BLACK } from 'lib/styles/colors'

export const TitleLink = styled(Link)`
    ${PositionBase}
    ${NoUnderlineEver}
    vertical-alignment: center;
    img {
        float:left;
        margin-right:5px;
        width:60px;
    }

    h1 {
        float:left;
        font-size: 20px;
        line-height: 1;
        margin-top:20px;
        margin-right: 30px;
        color: ${DEFAULT_BLACK_TRANSPARENT};
        
        &:hover {
            color: ${DEFAULT_BLACK};
        }
    }

    .nice-red-badge {
        top:10px;
    }
`