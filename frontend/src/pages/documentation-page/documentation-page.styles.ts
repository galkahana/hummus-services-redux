import styled from 'styled-components'
import { PrettyClickable, NoUnderlineEver, DefaultItemContainer } from 'components/common.styles'

export const Content = styled.div`

    .documentation-nav-bar {
        .dropdown-menu {
            ${DefaultItemContainer}
    
            .nav-link {
                ${PrettyClickable}
                ${NoUnderlineEver}
            }        


        }

        .job-ticket-dropdown > .dropdown-menu{
            min-width: 200px;
        }
    }

    .documentation-content {
        padding:10px;

        a {
            ${PrettyClickable}
            ${NoUnderlineEver}
        }

    }    
`