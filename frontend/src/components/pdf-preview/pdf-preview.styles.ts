import styled, { css } from 'styled-components'


const FullSize = css`
    width:100%;
    height:100%;
`


export const PDFPreviewContainer = styled.div`
    ${FullSize}
`

export const Instructions = styled.div`
    ${FullSize}
    background-color:white;
    text-align:center;
    padding-top:20px;    
`

export const PreviewContainer = styled.div`
    ${FullSize}

    object {
        ${FullSize}
    }
`