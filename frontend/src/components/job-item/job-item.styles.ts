import styled from 'styled-components'
import { DEFAULT_BLACK, DEFAULT_BLACK_TRANSPARENT } from 'lib/styles/colors'
import { DefaultItemContainer } from 'components/common.styles'

export const ItemContainer = styled.div`
    @keyframes waiting-to-error {
        0% {
            opacity:1;
            background-color:orange; 
        }
        40% { 
            opacity:0;
            background-color:orange; 
        }
        70% {
            background-color:red; 
        }    
        100% {
            opacity:1;
            background-color:red; 
        }
    }

    @keyframes waiting-to-success {
        0% {
            opacity:1;
            background-color:orange; 
        }
        40% { 
            opacity:0;
            background-color:orange; 
        }
        70% {
            background-color:green; 
        }    
        100% {
            opacity:1;
            background-color:green; 
        }
    }


    display:block;

    color: rgb(33, 33, 33);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13.1999998092651px;
    line-height: 19.7999992370605px;
    outline-color: rgb(33, 33, 33);
    outline-style: none;
    outline-width: 0px;
    background:white;
    box-shadow: 0 -1px 0 #e5e5e5,0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24);


    padding:4px 14px;

    .item-title {
        cursor: pointer;
        overflow-x: hidden;
        overflow-y: hidden;
        white-space: nowrap;
        display: flex;
        direction: row;
        align-items: center;
        
        .item-select {
            width:20px;
            height:20px;
            border: 2px solid ${DEFAULT_BLACK_TRANSPARENT};
            margin-right:10px;
            text-align: center;
            font-size: 14px;
            
            &:hover {
                border-color: ${DEFAULT_BLACK};
            }
        }
        
        .title {
            margin-right:10px;
            color: ${DEFAULT_BLACK_TRANSPARENT};
            width: calc( 100% - 70px );
            
            &:hover {
                color: ${DEFAULT_BLACK};
            }
        }
        
        .status {
            width:20px;
            height:20px;
            border-radius: 10px;
            background-color:black;
            margin-left: auto;
            
            &.status-success {
                background-color:green;
            }
            &.status-failure {
                background-color:red;
            }
            &.status-waiting {
                background-color:orange;                
            }
            
            &.waiting-to-success {
                animation: waiting-to-success 2s linear 1 forwards;
            }
            
            &.waiting-to-error {
                animation: waiting-to-error 2s linear 1 forwards;
            }
            
        }
    }

    .item-main
    {
        ${DefaultItemContainer}

        margin:20px;
        padding:10px;
        
        >.row {
            margin-top: 10px;                
            margin-bottom: 10px;                
        }
        
        .item-label {
            font-weight:700;
        }
        
        .status {
            color:black;
            
            &.status-success {
                color:green;
            }
            &.status-failure {
                color:red;
            }
            &.status-waiting {
                color:orange;
            }
            
        }
        
        .pdf-download {
            margin-right:20px;    
        }
    }    

`