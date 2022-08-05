import React from 'react'

import { PreviewContainer, Instructions, PDFPreviewContainer } from './pdf-preview.styles'

type PDFPreviewProps = {
    embed: string
    download: string
}


const PDFPreview = ({ embed, download }: PDFPreviewProps) => {

    if(embed && download) {
        return (
            <PDFPreviewContainer>
                <PreviewContainer>
                    <object data={embed} type="application/pdf">
                    This browser does not support PDF preview. <a href={download}>download</a>
                    </object>
                </PreviewContainer>
            </PDFPreviewContainer>
        )
    }
    else {
        return <PDFPreviewContainer>
            <Instructions>
                <h2>Preview Pane</h2>
            </Instructions>
        </PDFPreviewContainer>
    }
}

export default PDFPreview