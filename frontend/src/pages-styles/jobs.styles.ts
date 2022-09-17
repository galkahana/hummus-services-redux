import styled from 'styled-components'
import { DEFAULT_BLACK, DEFAULT_BRIGHT_BLUE } from '@lib/styles/colors'
import { PrettyClickable } from '@components/common.styles'



const TOOLBAR_BACKGROUND = '#aaaaaa'
const CONTROL_BACKGROUND = '#999999'
const CONTROL_BORDER = '#555555'

const SELECTION_TOOLBAR_BACKGROUND = '#CAAA52'
const SELECTION_CONTROL_BACKGROUND = '#b09447'
const SELECTION_CONTROLER_BORDER = '#9a813e'



export const JobsPage = styled.div`

@keyframes spin { 100% { transform:rotate(360deg); } }

.container {
    padding:20px 0;
    .toolbar {
        position: sticky;
        margin-bottom: 20px;        
        display:block;
        
        &.detached {
            position:fixed;
            top:0;
            z-index:5000;
            left: 50%;
            transform: translateX(-50%);
            
            .toolbar-frame {
                box-shadow: 0 -1px 0 #e5e5e5,0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24);
            }
        }
        
        &.selection {
            .hide-when-unselected {
                display:inline-block;
            }
            .hide-when-selected {
                display:none;
            }

            .toolbar-frame {
                background-color:${SELECTION_TOOLBAR_BACKGROUND};
                
                .btn.btn-default {
                    background-color: ${SELECTION_CONTROL_BACKGROUND};
                    border-color: ${SELECTION_CONTROLER_BORDER};
                }
            }
        }           


        .hide-when-unselected {
            display:none;
        }
        
        .toolbar-frame {
            background-color:${TOOLBAR_BACKGROUND};
            padding:8px 14px;

            
            .btn {
                ${PrettyClickable}
                outline:none;
                box-shadow: none;
                background-color: ${CONTROL_BACKGROUND};
                border-color: ${CONTROL_BORDER};
                line-height: 1;
            }

            .jobs-query-bar {

                .refresh-group {
                    margin-right:20px;

                    .refreshing {
                        animation:spin 1s linear infinite;
                    }                
                } 
                
                .search-group {
                    margin-right:20px;
                    width:40%;
                    background-color: ${CONTROL_BACKGROUND};
                    border: 1px solid ${CONTROL_BORDER};
                    padding: 6px 4px 6px 4px;
                    border-radius: 4px;   
                    line-height:1;
                    
                    form  {
                        width: 100%;

                        .search-bar-text {
                            width: 100%;
                            
                            input {
                                width:100%;
                                background-color:${CONTROL_BACKGROUND};
                                border:0;
                                color:$default-black;
                                outline:none;
                            }
                        }
    
                    }
                    
                }
                
                .date-filter-group {
                    margin-right:20px;
                    background-color: ${CONTROL_BACKGROUND};
                    border: 1px solid ${CONTROL_BORDER};
                    padding: 6px 4px 6px 4px;
                    border-radius: 4px;   
                    line-height:1;
                    
                    .react-datepicker__close-icon {
                        background-color:${CONTROL_BACKGROUND};
                        margin: 0 10px;
                        border: 0;
                        outline: none;
                        padding: 0;
    
                        :after {
                        background-color: ${CONTROL_BACKGROUND};
                        color: ${DEFAULT_BLACK};
                        font-size: inherit;
                        }
                    }
                    
                    .react-datepicker__input-container {
                        width: 15em;
                        
                        input {
                            width:100%;
                            background-color:${CONTROL_BACKGROUND};
                            border:0;
                            color: ${DEFAULT_BLACK};
                            outline:none;
                        }
                    }
                }            
            }

            .selected-jobs-activity-bar {
                .selection-group {
                    margin-right:20px;
                    
                    >div {
                        display:inline-block;
                        vertical-align: middle;
                        padding: 5px 0;
                    }
                    
                    .cancel-selection {
                        .icon {
                            margin-right:5px;
                        }
                        
                        margin-right:20px;
                    }
                    
                    .selection-count {
                        color: ${DEFAULT_BRIGHT_BLUE};
                    }            
                }

                .select-all-group {
                    margin-right: 20px;
                }
                
                .btn-delete-files {
                    img {
                        width:18px;
                    }
                }
            }
        }
    }
}
`