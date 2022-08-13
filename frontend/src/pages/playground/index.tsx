import React, { useState, useCallback, useEffect } from 'react'

import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import Split from 'react-split'
import moment from 'moment'


import ConsoleBase from 'components/console-base'
import hummusClientService from 'lib/hummus-client/service'
import { TokensAPIResponse } from 'lib/hummus-client/types'
import PDFPreview from 'components/pdf-preview'
import { PrettyClickableLink } from 'components/common.styles'
import ButtonWithSpinner from 'components/waiting/button-with-spinner'
import { useModalAlert } from 'components/modal-alert/context'
import { siteUrlRoot, apiUrl } from 'lib/urls'

import { PlaygroundPage } from './playground.styles'
import { getDefaultDateDisplay } from 'lib/dates'


const SAMPLE_CODE = `{
    "title": "Sample.pdf",
    "meta": {
        "label": "Sample Job ${moment().format('MMMM Do YYYY, h:mm:ss a')}"
    },
    "externals": {
            "gaLogo":"https://github.com/galkahana/hummus-services/blob/master/src/public/images/profileImage.jpg?raw=true"
        },
    "document" : {
        "embedded" : {
            "pages": [
                {
                    "width": 595,
                    "height": 842,
                    "boxes": [
                        {
                            "bottom": 500,
                            "left": 10,
                            "text": {
                                "text": "hello world!",
                                "options": {
                                    "fontSource": "arial",
                                    "size": 40,
                                    "color": "pink"
                                }
                            }
                        },
                        {
                            "bottom": 600,
                            "left": 10,
                            "image": {"source":"gaLogo"}
                        }
                    ]
                }
            ]
        }
    }
}`

const BROWSER_CODE_SEGMENT_1 = `<script type="text/javascript" src="${siteUrlRoot}/hummus/hummusservice.js"></script>
`

const get_browser_code_segment_2 = (key: string) => `hummusService.generatePDFDocument(
    '${apiUrl}',
    '${key}', 
    '{.....}',
    function(urlDownload,urlEmbed){
        /* success */
    },
    function(){
        /* error */
    });
`

const NODE_CODE_SEGMENT_1 = `npm install hummus-client
`

const get_node_code_segment_2 = (key: string) => `var hc = require('hummus-client')('${key}', '${apiUrl}'}});
`

const NODE_CODE_SEGMENT_3 = `hc.jobs.createAndDownload(/* The ticket */,function(err,readable) {
    if(err) {
        // handle error
    }
    else {
        // do something with the readable stream, containing the new pdf
        readable
            .on('response', function(response) {
                // use for getting general resonse data
            })
            .on('error', function(err) {
                // handle stream reading error
            })        
            .pipe(fs.createWriteStream(/* some file path */));
    }
});
`

const HTTP_CODE_SEGMENT_1 =`{
    uid:"The Job ID"
    status:1
    /* other items of lesser importance */
}`

const HTTP_CODE_SEGMENT_2 = `{
    uid:"The Job ID"
    status:0
    generatedFileObject : {
        uid: "The File ID", 
        publicDownloadId: "The Public Download ID"
    }
    /* other items of lesser importance */
}`

const trimToSize = (text: string, maxSize: number) => {
    if(text.length <= maxSize)
        return text

    return `${text.substring(0, maxSize-3)}...`
}

const Playground = () => {
    const [ downloadLink, setDownloadLink ] = useState<string>('')
    const [ embedLink, setEmbedLink ] = useState<string>('')
    const [ code, setCode ] = useState<string>(SAMPLE_CODE)
    const [ waiting, setWaiting ] = useState<boolean>(false)
    const [ apiTokens, setAPITokens ] = useState<TokensAPIResponse>({})
    const [ deleteFileAt, setFileDeleteAt ] = useState<string>('')

    const showModalAlert = useModalAlert()

    useEffect(()=>{
        // ignore if fails...it's for show and tell only anyways
        hummusClientService.getTokens().then(setAPITokens).catch((ex) => {
            console.log(ex)
        })
    }, [ setAPITokens ])

    const onChange = useCallback((value: string)=> setCode(value), [])

    const onSubmitTicketClick = useCallback(() => {
        let parsedCode: object = {}
        try {
            parsedCode = JSON.parse(code)
        } catch(ex: unknown) {
            showModalAlert( ex instanceof Error ? ex.message: 'Something went wrong in attempting to parse the code to json...and it wont tell us what happened', 'File Creation Error')
            return
        }

        setWaiting(true)
        hummusClientService.generatePDFDocument(parsedCode).then(({ embed, download, jobData }) => {
            setDownloadLink(download)
            setEmbedLink(embed)
            setFileDeleteAt(getDefaultDateDisplay(jobData.deleteFileAt))
        }).catch((ex: unknown) => {
            showModalAlert( ex instanceof Error ? ex.message: 'Something went wrong in attempting to run the job...and it wont tell us what happened', 'File Creation Error')
        }).then(() => {
            setWaiting(false)
        })
    }, [ setDownloadLink, setEmbedLink, code, showModalAlert ])

    const getKeyForBrowser = () => {
        return trimToSize(apiTokens.public?.token || '/* Your public API key */', 50)
    }

    const getKeyForHTTP = () => {
        return trimToSize(apiTokens.private?.token || apiTokens.public?.token || '/* Your API key */', 50)
    }

    const getKeyForNode = () => {
        return trimToSize(apiTokens.private?.token ||  '/* Your private API key */', 50)
    }

    return (<ConsoleBase title="Playground" subtitle="Create & Test Job Tickets">
        <PlaygroundPage>
            <Container>
                <div className="section editor">
                    <div className="editor-controls">
                        <ButtonWithSpinner variant="primary" className='generate' waiting={waiting} onClick={onSubmitTicketClick}>
                            Preview PDF
                        </ButtonWithSpinner>
                        {
                            downloadLink && ( 
                                <span><a target="_blank"  className="pdf-download" href={downloadLink} rel="noreferrer">Download Preview</a> (File will be deleted at {deleteFileAt})</span>
                            )
                        }
                    </div>                
                    <div className="editor-split-screen">
                        <Split
                            className="split" direction="horizontal"
                        >   
                            <div className="editor-split-screen-cell">
                                <CodeMirror
                                    extensions={[ json() ]}
                                    value={code}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="editor-split-screen-cell">
                                <PDFPreview embed={embedLink} download={downloadLink}/>
                            </div>
                        </Split>

                    </div>
                </div>   
                <div className="section examples">
                    <div className="section-title">
                        <h3>Using this ticket with:</h3>
                    </div>   
                    <div>
                        <Tabs
                            defaultActiveKey="browser"
                            className="tab-pane"
                        >
                            <Tab eventKey="browser" title="Browser">
                                <p>Create A PDF file directly in the client's browser by following these steps:</p>
                                <ol>
                                    <li>
                                        <p>Acquire a public api key. You can do this through users settings api keys tab - <PrettyClickableLink to="user">here</PrettyClickableLink>.</p>
                                    </li>
                                    <li>
                                        <p>In your web page include hummus client library by adding a script tag:</p>
                                        <pre>{BROWSER_CODE_SEGMENT_1}</pre>
                                    </li>
                                    <li>
                                        <p>Where relevant make a call to <code>hummusService.generatePDFDocument</code> to generate the PDF file, like this:</p>
                                        <pre>{get_browser_code_segment_2(getKeyForBrowser())}</pre>
                                        <p>Provide the service root url, the public api key and job ticket string as the parameters. Then also a callback for success and another for failure.</p>
                                        <p>The success callback accepts two parameters. <code>urlDownload</code> can be used for downloading the PDF file. <code>urlEmbed</code> can be used for opening the PDF in a window
                            or embedding in a page.</p>
                                    </li>
                                </ol>
                                <p>
                                    <strong>Important! using a public key this way exposes it to readers of the site code. Choose other methods if you don't want your key to be potentially used by others.</strong>
                                </p>                            
                            </Tab>
                            <Tab eventKey="nodejs" title="NodeJS">
                                <p>Create A PDF file by following these steps:</p>
                                <ol>
                                    <li>
                                        <p>Acquire a private api key. You can do this through users settings api keys tab - <PrettyClickableLink to="user">here</PrettyClickableLink>.</p>
                                    </li>
                                    <li>
                                        <p>Install <code>hummus-client</code> with:</p>
                                        <pre>{NODE_CODE_SEGMENT_1}</pre>
                                    </li>
                                    <li>
                                        <p>Create a hummus client instance with you private API token like this:</p>
                                        <pre>{get_node_code_segment_2(getKeyForNode())}</pre>
                                    </li>
                                    <li>
                                        <p>Where relevant make a call to <code>hc.jobs.createAndDownload</code>:</p>
                                        <pre>{NODE_CODE_SEGMENT_3}</pre>
                                        <p>Provide the ticket string as the first parameter. The second parameter is a callback to be executed when the job is finished.</p>
                                        <p>In the callback the first parameter is a general error object. The second parameters is a readable stream of the resulting PDF, allowing
                                    you to write the PDF result to wherever you want. In this example the readable stream is piped to a file stream.</p>
                                    </li>
                                </ol>
                            </Tab>
                            <Tab eventKey="http" title="HTTP">
                                <p>You can create a PDF file from either client or server using REST calls to Hummus Services:</p>
                                <ol>
                                    <li><p>First, acquire either a public or private API keys (public for client, private for server) You can do this through users settings api keys tab - <PrettyClickableLink to="user">here</PrettyClickableLink>.</p></li>
                                    <li><p>Then, start a PDF creation job with the following REST call:</p>
                                        <ul>
                                            <li><strong>METHOD:</strong> POST</li>
                                            <li><strong>URL:</strong>{apiUrl}/generation-jobs</li>
                                            <li><strong>HEADERS:</strong> <br/>Authorization: Bearer {getKeyForHTTP()}
                                                <br/>Content-type: application/json; charset=utf-8
                                            </li>
                                            <li><strong>BODY:</strong>{'/* The Ticket */'}</li>
                                        </ul>
                                        <p>The response body will contain the new job data. For example:</p>
                                        <pre>{HTTP_CODE_SEGMENT_1}</pre>
                                        <p>
                                    The Job ID can be used to track this job later. Status of 1 marks that job is still in progress.
                                        </p>
                                    </li>
                                    <li><p>Check the job status on occasion with this REST call:</p>
                                        <ul>
                                            <li><strong>METHOD:</strong> GET</li>
                                            <li><strong>URL:</strong>{apiUrl}/generation-jobs/:id?full=true</li>
                                            <li><strong>HEADERS:</strong> <br/>Authorization: Bearer {getKeyForHTTP()}
                                                <br/>Content-type: application/json; charset=utf-8
                                            </li>
                                        </ul>
                                        <p>For ":id" use the job ID that you recieved as response from the initial creation call.</p>
                                        <p>The response body will contain the current job data. For example:</p>
                                        <pre>{HTTP_CODE_SEGMENT_2}</pre>
                                        <p>Status can be either 1 (in progress), 2 (done) or 3 (error). If the status is 2, then an additional property
                                    is added - <code>generatedFileObject</code>. This object uid property is the file ID that can be used for downloading with another rest call.
                                    publicDownloadId, if exists can be used with public download url, that does not require a Bearer token.
                                        </p>
                                    </li>
                                    <li><p>Finally, download the file with this REST call:</p>
                                        <ul>
                                            <li><strong>METHOD:</strong> GET</li>
                                            <li><strong>URL:</strong>{apiUrl}/generated-files/:id/download</li>
                                            <li><strong>HEADERS:</strong> <br/>Authorization: Bearer {getKeyForHTTP()}
                                            </li>
                                        </ul>      
                                        <p>For ":id" use the file ID that you recieved as response from the job status call.</p>
                                        <p>The response would be the PDF content.</p>
                                        <p>Alternatively, use the publicDownloadId with the public download URL like this:</p>
                                        <pre>{apiUrl}/public/:publicDownloadId</pre>
                                        <p>This form is useful if you want to send the PDF file as a download link to someone, and do not have the facilities to provide it via your own means.</p>
                                    </li>
                                    <p>
                                        <strong>Important! using a public key over client code exposes it to readers of the site code. Choose other methods if you don't want your key to be potentially used by others.</strong>
                                    </p>                            
                                </ol>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </Container>
        </PlaygroundPage>
    </ConsoleBase>)
}

export default Playground