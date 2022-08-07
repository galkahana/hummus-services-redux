import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import { DefaultItemContainer } from 'components/common.styles'

const CONTROL_BACKGROUND = '#999999'
const CONTROL_BORDER = '#555555'

export const PlanPanelContainer = styled(Container)`

    @keyframes spin { 100% { transform:rotate(360deg); } }

    .spinning {
        animation:spin 1s linear infinite;
    }

    .glyphicon {
        font-size: 18px;
    }

    ${DefaultItemContainer}

    padding:10px;
    
    .row {
        .key-container {
            border: 1px solid ${CONTROL_BORDER};
            background: ${CONTROL_BACKGROUND};
            padding: 6px 4px 6px 4px;
            border-radius: 4px;
            word-wrap: break-word;
            margin-top: 5px;
        }
    }
`