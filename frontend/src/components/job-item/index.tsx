import React, { useEffect, useRef, useState, useMemo } from 'react'
import moment from 'moment'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRemove, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { GenerationJobResponse, JobStatus } from 'lib/hummus-client/types'
import hummusClient from 'lib/hummus-client'
import ButtonWithSpinner from 'components/waiting/button-with-spinner'
import { PrettyClickableAnchor } from 'components/common.styles'
import { useModalConfirm } from 'components/modal-confirm/context'

import { ItemContainer } from './job-item.styles'

const STATUS_CLASSES = [
    'status-success',
    'status-waiting',
    'status-failure'    
]

const STATUS_TEXT = [ 'Done', 'In Progress', 'Failed' ]

const DEFAULT_DATE_TIME_FILTER  = 'MMM Do, y HH:mm:ss:SSS'

const getDefaultDateDisplay = (date: Date) => date ? `${moment(date).format(DEFAULT_DATE_TIME_FILTER)}ms` : 'N/A'

export type JobItemProps = {
    job: GenerationJobResponse
    onSelectionChanged: (isSelected: boolean, targetJob: GenerationJobResponse) => void
    onJobFileDeleteRequest: (targetJob: GenerationJobResponse) => Promise<unknown>
    selected: Boolean
}

const JobItem = ({ job, onSelectionChanged, selected, onJobFileDeleteRequest }: JobItemProps) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [ isJobTicketOpen, setIsJobTicketOpen ] = useState<boolean>(false)
    const [ waitingForPDFDelete, setWaitingForPDFDelete ] = useState<boolean>(false)
    const [ jobStatusStyle, setJobStatusStyle ] = useState<string>(STATUS_CLASSES[job.status])
    const jobRef = useRef<GenerationJobResponse>(job)

    const showModalConfirm = useModalConfirm()

    useEffect(()=> {
        // tracking job status change to allow for very neat and important animation
        if(jobRef.current.status !== job.status) {
            if(job.status === JobStatus.JobDone)
                setJobStatusStyle('waiting-to-success')
            else if(job.status === JobStatus.JobFailed)
                setJobStatusStyle('waiting-to-error')
        }
        jobRef.current = job
    }, [ job ])

    const onToggleItemMainclick = () =>{
        setIsOpen(value => !value)
    }

    const onSelectionClicked = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onSelectionChanged(!selected, job)
    }

    const onToggleJobTicketClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation()
        setIsJobTicketOpen( (value) => !value)
    }

    const prettyJobTicket = useMemo(() => {
        return JSON.stringify(job.ticket, null, 2)
    }, [ job ])

    const onPDFDeleteClick = async () => {

        const doesUserConfirm = await showModalConfirm(
            'You are about to permanently delete the file for this job. This action **may not** be undone. You good with that?',
            {
                confirmTitle: 'Warning',
                confirmText: 'Sure',
                rejectText: 'Nope'
            })

        if(!doesUserConfirm)
            return

        setWaitingForPDFDelete(true)
        onJobFileDeleteRequest(job).then(() => setWaitingForPDFDelete(false))
    }

    const title = job.label  || `'Item #${job.uid}`
    const startDateDisplay = getDefaultDateDisplay(job.createdAt)
    const endDateDisplay = job.status === JobStatus.JobInProgress ? 'N/A' : getDefaultDateDisplay(job.updatedAt)

    return <ItemContainer>
        <h4 className="item-title" onClick={onToggleItemMainclick}>
            <div className="item-select" onClick={onSelectionClicked}>
                {
                    selected && (<FontAwesomeIcon icon={faCheck}/>)
                }
            </div>
            <div className="title">{title}</div>
            <div className={`status ${jobStatusStyle}`}></div>
        </h4>
        { isOpen && (
            <div className = 'item-main'>
                <Row>
                    <Col sm={2} className="item-label">Started:</Col>
                    <Col sm={10} className="item-label">{startDateDisplay}</Col>
                </Row>
                <Row>
                    <Col sm={2} className="item-label">Finished:</Col>
                    <Col sm={10} className="item-label">{endDateDisplay}</Col>
                </Row>
                <Row>
                    <Col sm={2} className="item-label">Job Name:</Col>
                    <Col sm={10} className="item-label">{job.label}</Col>
                </Row>
                <Row>
                    <Col sm={2} className="item-label">Status:</Col>
                    <Col sm={10} className={`status ${STATUS_CLASSES[job.status]}`}>{STATUS_TEXT[job.status]}</Col>
                </Row>
                <Row>
                    <Col sm={2} className="item-label">PDF File:</Col>
                    <Col sm={10}>
                        {job.generatedFile ? (
                            <span>
                                <a target="_blank" className="pdf-download" href={hummusClient.getGeneratedFileDownloadUrl(job.generatedFile.uid)} rel="noreferrer">Download</a>
                                <ButtonWithSpinner className='pdf-remove' variant="danger" onClick={onPDFDeleteClick} waiting={waitingForPDFDelete}>
                                    <div className="delete"><FontAwesomeIcon icon={faRemove}/> Delete</div>
                                </ButtonWithSpinner>
                            </span>
                        ) : (
                            <span>N/A</span>
                        )
                        }

                    </Col>
                </Row>
                <Row>
                    <Col sm={2} className="item-label">Job Ticket:</Col>
                    <Col sm={10} className="item-label">
                        <PrettyClickableAnchor onClick={onToggleJobTicketClick}>
                            <FontAwesomeIcon icon={isJobTicketOpen ? faCaretDown : faCaretRight }/>
                        </PrettyClickableAnchor>
                    </Col>
                </Row>
                {Boolean(isJobTicketOpen) &&(
                    <Row>
                        <Col sm={10} offset={2}>
                            <pre className="pre-scrollable">{prettyJobTicket}</pre>
                        </Col>
                    </Row>
            
                )}

            </div>
        )
        }
    </ItemContainer>
}

export default JobItem