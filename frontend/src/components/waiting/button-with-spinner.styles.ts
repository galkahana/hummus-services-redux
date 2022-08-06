import styled from 'styled-components'

export type WaitingProps = {
    waiting: boolean
}

type VariantProps = {
    variant: string
}


const LIKES_WHITE_BACKGROUND = [ 'primary', 'danger' ]

export const ButtonSpinnerContent = styled.div.attrs(({ waiting }: WaitingProps) => ({ className: waiting && 'spinner-active' }))`
    .spinner {
        visibility:hidden;
        height:0;
        overflow:hidden;

        margin:0;
        >div {
            width: 12px;
            height: 12px;
            ${({ variant }: VariantProps) => LIKES_WHITE_BACKGROUND.includes(variant) ? 'background-color:white;': ''}
        }    
    }

    &.spinner-active {
        .spinner {
            visibility:visible;
            height: auto;
            margin: 0 auto;  
            overflow:visible;      
        }
        
        .default {
            visibility:hidden;
            height:0;
            overflow:hidden;
        }                
    }
`