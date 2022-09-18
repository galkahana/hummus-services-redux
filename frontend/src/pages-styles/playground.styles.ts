import styled from 'styled-components'

const VIEW_HEIGHT = '600px'

export const PlaygroundPage = styled.div`
    .generate {
        padding:3px 6px;
        margin-right:20px;
    }


    .section {
        margin-bottom:20px;
    }

    .editor-controls {
        margin-bottom:10px;
    }

    .editor-split-screen-cell
    {
        height:${VIEW_HEIGHT};

    }    

    .cm-editor {
        height:${VIEW_HEIGHT};
    }

    .split {
        display: flex;
        flex-direction: row;
    }
      
    .gutter {
        resize: none;
        background-color: rgb(185, 185, 185);
        background-position: 50%;
    }
      
    .tab-pane {
        margin: 20px auto;    
    }

    .section.examples {
        pre {
            white-space: pre-wrap;       
            white-space: -moz-pre-wrap; 
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
        }
    }
`