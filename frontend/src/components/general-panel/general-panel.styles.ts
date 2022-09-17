import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import { DefaultItemContainer } from '@components/common.styles'

export const GeneralPanelContainer = styled(Container)`
    .section {
        margin-bottom:10px;

        .section-content {
            ${DefaultItemContainer}
            padding:10px;
        }
    }
`