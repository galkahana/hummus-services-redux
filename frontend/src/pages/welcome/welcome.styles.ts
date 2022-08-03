import styled from 'styled-components'
import { HUMMUS_COLOR } from 'lib/styles/colors'

const Section = styled.div`
    text-align:center;
    padding:30px 0;  
`

export const TitleSection = styled(Section)`
    background-color:${HUMMUS_COLOR};
    color:#EAEAEA;

    h1 {
        margin-top:0;
    }   
`

export const FeaturesSection =styled(Section)`
    ul li {
        font-size:20px;
        margin: 0 10px;
        
        i {
            font-size:40px;
        }
}`

export const SignupSection = styled(Section)`
    button {
        color:#EAEAEA;
        font-size:30px;
        background-color:${HUMMUS_COLOR};
    }    
`

