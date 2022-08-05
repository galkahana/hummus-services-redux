import styled from 'styled-components'

export type WaitingProps = {
    waiting: boolean
}

type VariantProps = {
    variant: string
}



export const ButtonSpinnerContent = styled.div.attrs(({ waiting }: WaitingProps) => ({ className: waiting && 'spinner-active' }))`
    .spinner {
        visibility:hidden;
        height:0;
        overflow:hidden;

        margin:0;
        >div {
            width: 12px;
            height: 12px;
            ${({ variant }: VariantProps) => variant ==='primary' ? 'background-color:white;': ''}
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