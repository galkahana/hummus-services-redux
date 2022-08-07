import React, { useState, useCallback, useRef, useEffect } from 'react'
import moment from 'moment'
import { difference } from 'lodash'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faRefresh, faArrowLeft, faTrash, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import DatePicker from 'react-datepicker'

import hummusClientService from 'lib/hummus-client'
import { GenerationJobsQuery, GenerationJobResponse, JobStatus } from 'lib/hummus-client/types'
import { executeForAtLeast } from 'lib/async'
import ConsoleBase from 'components/console-base'
import JobsList from 'components/jobs-list'
import { useToast } from 'components/toast'
import { useModalAlert } from 'components/modal-alert/context'
import { useModalConfirm } from 'components/modal-confirm/context'

import deletePDFImage from 'assets/delete-pdf.png'

import { JobsPage } from './jobs.styles'
import { PrettyClickableDiv } from 'components/common.styles'
import DynamicPagination from 'components/dynamic-pagination'


const DOWN_THRESHOLD = 100
const MINIMAL_REFRESH_TIME = 500
const MINIMAL_SEARCH_IDLE_TIME = 1000
const CHECK_JOB_PROGRESS_PERIOD = 3000

const ITEMS_PER_PAGE = 50
const SIMPLE_PAGES_LIST_LIMIT = 9

const getLastMonth = () => moment().subtract(1, 'month').toDate()
const getToday = () => moment().toDate() 


const Jobs = () => {
    const [ isRefreshing, setIsRefreshing ] = useState<Boolean>(false)
    const [ searchTerm, setSearchTerm ] = useState<string>('')
    const [ dateRange, setDateRange ] = useState<[Nullable<Date>, Nullable<Date>]>([ getLastMonth(), getToday() ])
    const [ selectedJobs, setSelectedJobs ] = useState<GenerationJobResponse[]>([])
    const [ jobs, setJobs ] = useState<GenerationJobResponse[]>([])
    const [ isDeletingJobs, setIsDeletingJobs ] = useState<boolean>(false)
    const [ isDeletingJobsFiles, setIsDeletingJobsFiles ] = useState<boolean>(false)
    const [ isDetachingToolbar, setIsDetachingToolbar ] = useState<boolean>(false)
    const [ currentPage, setCurrentPage ] = useState<number>(0)

    // a helper to avoid fetching multiple time due to excited user actions
    const isFetchingData = useRef<boolean>(false)
    // idle typing timeout
    const searchTermTypingIdleTimeout = useRef<Nullable<ReturnType<typeof setTimeout>>>(null)
    // using ref for actual search, so it's easier to control when it's being triggered
    const loadingSearchTerm = useRef<string>('')
    const loadingDateRange = useRef<[Nullable<Date>, Nullable<Date>]>([ getLastMonth(), getToday() ])
    // this one here allows to differ initial window load time from later edits
    const didEdit = useRef<boolean>(false)

    const showToast = useToast()
    const showModalAlert = useModalAlert()
    const showModalConfirm = useModalConfirm()
    

    const loadData = useCallback(async () => {
        if(isFetchingData.current)
            return
        isFetchingData.current = true
        setSelectedJobs([])

        const params: GenerationJobsQuery = { full: true }

        if(loadingSearchTerm.current)
            params.searchTerm = loadingSearchTerm.current

        if(loadingDateRange.current[0])
            params.dateRangeFrom = moment(loadingDateRange.current[0]).startOf('day').toDate().toString() // inclusive on from 

        if(loadingDateRange.current[1])
            params.dateRangeTo =   moment(loadingDateRange.current[1]).endOf('day').toDate().toString()
        try {
            const newJobs = await hummusClientService.getJobs(params)
            setJobs(newJobs)
        } catch(ex) {
            // maybe show something on error? maybe not
            showToast('Jobs fetching failed', 'Jobs')
        }
        isFetchingData.current = false
        setCurrentPage(0)
    }, [ showToast ])

    // update current per updates on the fields
    useEffect(()=> {
        loadingSearchTerm.current = searchTerm
    }, [ searchTerm ])
    useEffect(()=> {
        loadingDateRange.current = dateRange
    }, [ dateRange ])


    // loading data on several scenarios

    // the general thing
    const refreshWithFormData = useCallback(() => {
        setIsRefreshing(true)
        // give us at least half a spin, so ppl know something was happening
        executeForAtLeast(loadData(), MINIMAL_REFRESH_TIME).then(() =>{
            setIsRefreshing(false)
        })
    }, [ loadData ])

    // loading data on page load
    useEffect(() => {
        refreshWithFormData()
    }, [ refreshWithFormData ])

    // loading data on date range submit
    useEffect(() => {
        if(!didEdit.current)
            return

        // only when it's complete (two dates)
        if(dateRange[0] && dateRange[1])
            refreshWithFormData()
    }, [ refreshWithFormData, dateRange ])

    // loading data on submitting search form (a loud "enter" after clicking something)
    const onSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        didEdit.current = true
        event.preventDefault()
        refreshWithFormData()
    }, [ refreshWithFormData ])


    // loading data on search term change, after idle time had passed to avoid multiple refreshes while typing
    useEffect(() => {
        if(!didEdit.current)
            return

        if(searchTermTypingIdleTimeout.current) {
            clearTimeout(searchTermTypingIdleTimeout.current)
            searchTermTypingIdleTimeout.current = null
        }
        searchTermTypingIdleTimeout.current = setTimeout(() => {
            refreshWithFormData()
        }, MINIMAL_SEARCH_IDLE_TIME)
    }, [ refreshWithFormData, searchTerm ])

    // loading data on refresh button click
    const onRefreshClick = refreshWithFormData

    // and this ends that.

    const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        didEdit.current = true
        setSearchTerm(event.target.value)
    }, [ setSearchTerm ])

    const onDatePickerChange = useCallback((newDates: [Nullable<Date>, Nullable<Date>]) => {
        didEdit.current = true
        setDateRange(newDates)
    }, [ setDateRange ] )

    const onJobSelectionChanged = useCallback((selected: Boolean, job: GenerationJobResponse) => {
        setSelectedJobs((value) => {
            let newValue = value
            if(selected && !value.includes(job))
                newValue = [ ...value, job ]
            else if(!selected && value.includes(job))
                newValue = value.filter((selectedJob) => selectedJob !== job )
            return newValue
        })
    }, [])

    const onJobFileDeleteRequest = useCallback(async (theJob: GenerationJobResponse) => {
        try {
            await hummusClientService.deleteFilesForJobs([ theJob.uid ])
            const newJob = { ...theJob, generatedFile: null }
            // update data object. so will update both collections of job with new job object
            const newJobs = jobs.map((aJob) => aJob === theJob ? newJob : aJob)
            const newSelectedJobs = selectedJobs.map((aJob) => aJob === theJob ? newJob : aJob)

            setJobs(newJobs)
            setSelectedJobs(newSelectedJobs)

            showToast('Job file deleted', 'Jobs')
        } catch(ex: unknown) {
            showModalAlert(ex instanceof Error ? ex.message : `The was an error deleting the file for job ${theJob.uid} but it won't tell us what it was.`, 'Job Page Error')
        }
    }, [ jobs, selectedJobs, showToast, showModalAlert ])

    const onCancelSelectionClick = useCallback(()=> {
        setSelectedJobs([])
    }, [ setSelectedJobs ])

    const onSelectAllClick = useCallback(() => {
        if(jobs.length === selectedJobs.length)
            // ppl will naturally click it again when there's selected stuff...so just empty and don't argue
            setSelectedJobs([])
        else
            setSelectedJobs([ ...jobs ])
    }, [ jobs, selectedJobs, setSelectedJobs ])


    const onDeleteJobsClick = useCallback(async () => {
        const doesUserConfirm = await showModalConfirm(
            `You are about to *permanenetly* delete the selected Job${selectedJobs.length > 1 ? 's':''}. This action cannot be undone.\n\nAre you sure that you want to continue?`,
            {
                confirmTitle: 'Warning',
                confirmText: 'Yes',
                rejectText: 'No'
            }
        )

        if(!doesUserConfirm)
            return


        setIsDeletingJobs(true)
        const jobIDs = selectedJobs.map((job)=> job.uid)
        try {
            await hummusClientService.deleteJobs(jobIDs)
            // and update the lists
            setJobs(difference(jobs, selectedJobs))
            setSelectedJobs([])
            showToast(`Job${selectedJobs.length > 1 ?'s':''} deleted successfully`, 'Jobs')
        } catch(ex: unknown) {
            showModalAlert(ex instanceof Error ? ex.message : `The was an error deleting the jobs ${jobIDs} but it won't tell us what it was.`, 'Job Page Error')
        }
        setIsDeletingJobs(false)
    }, [ jobs, selectedJobs, setIsDeletingJobs, setJobs, setSelectedJobs, showToast, showModalAlert, showModalConfirm ])


    const onDeleteJobsFilesClick = useCallback(async () => {
        const doesUserConfirm = await showModalConfirm(
            `You are about to *permanenetly* delete PDF file${selectedJobs.length > 1 ? 's':''} for the selected job${selectedJobs.length > 1 ? 's':''}. This action cannot be undone.\n\nAre you sure that you want to continue?`,
            {
                confirmTitle: 'Warning',
                confirmText: 'Yes',
                rejectText: 'No'
            }
        )

        if(!doesUserConfirm)
            return

        setIsDeletingJobsFiles(true)
        const jobIDs = selectedJobs.map((job)=> job.uid)
        try {
            await hummusClientService.deleteFilesForJobs(jobIDs)
            // and update the lists
            const newJobs = jobs.map((job) => selectedJobs.includes(job) ? { ...job, generatedFile: null }:job)
            setJobs(newJobs)
            setSelectedJobs([])
            showToast(`Job${selectedJobs.length > 1 ?'s':''} file${selectedJobs.length > 1 ?'s':''} deleted successfully`, 'Jobs')
        } catch(ex: unknown) {
            showModalAlert(ex instanceof Error ? ex.message : `The was an error deleting the jobs files for ${jobIDs} but it won't tell us what it was.`, 'Job Page Error')
        }
        setIsDeletingJobsFiles(false)


    }, [ jobs, selectedJobs, showToast, showModalAlert, showModalConfirm ])



    // and now for some stickiness
    const onDocumentScroll = useCallback(() => {
        const jobsListElement = document.querySelector<HTMLDivElement>('.jobs-list')
        if(!jobsListElement)
            return
        if(!isDetachingToolbar) {
            if(document.documentElement.scrollTop > jobsListElement.offsetTop + DOWN_THRESHOLD) {
                setIsDetachingToolbar(true)
            }
        }
        else {
            if(document.documentElement.scrollTop <= jobsListElement.offsetTop + DOWN_THRESHOLD) {
                setIsDetachingToolbar(false)
            }
        }
    }, [ isDetachingToolbar, setIsDetachingToolbar ])

    useEffect(() => {
        document.addEventListener('scroll', onDocumentScroll)
    
        return () => {
            document.removeEventListener('scroll', onDocumentScroll)
        }
    }, [ onDocumentScroll ])    

    // tracking jobs progress (not refreshing animation...just updating if there's updates)
    useEffect(() => {
        const jobsInProgress = jobs.filter((job) => job.status === JobStatus.JobInProgress)
        if(jobsInProgress.length > 0) {
            setTimeout(
                async () => {
                    const currentJobsInProgress = jobs.filter((job) => job.status === JobStatus.JobInProgress)
                    try {
                        const jobUpdates = await hummusClientService.getJobs({ in: currentJobsInProgress.map((job)=> job.uid), full: true })
                        const jobUpdatesDict = jobUpdates.reduce((acc:{[key:string]: GenerationJobResponse}, job) => {acc[job.uid] = job; return acc}, {})
                        setJobs(theJobs => theJobs.map((job)=> jobUpdatesDict[job.uid] ? jobUpdatesDict[job.uid]: job))                    
                        setSelectedJobs(theJobs => theJobs.map((job)=> jobUpdatesDict[job.uid] ? jobUpdatesDict[job.uid]: job))
                    } catch(ex: unknown) {
                        // fail silently...nevermind
                        console.log(ex)
                    }
                }
                , CHECK_JOB_PROGRESS_PERIOD
            )
        }
    }, [ jobs ])


    // pagination list
    const onPaginationPageChange = useCallback((value: number)=> {
        setCurrentPage(value)
    }, [ setCurrentPage ])

    return <ConsoleBase>
        <JobsPage>
            <Container>
                <div className={`toolbar ${selectedJobs.length > 0 ? 'selection':''} ${isDetachingToolbar ? 'detached container': ''}`}>
                    <div className="toolbar-frame">
                        <div className="jobs-query-bar hide-when-selected">
                            <ButtonGroup className="refresh-group">
                                <Button className="refresh" onClick={onRefreshClick}>
                                    <FontAwesomeIcon className={isRefreshing ? 'refreshing':''} icon={isRefreshing? faRefresh:faSearch } />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup className="search-group">
                                <form onSubmit={onSearchSubmit}>
                                    <div className="search-bar-text">
                                        <input type="text" value={searchTerm} placeholder="Search" onChange={onSearchChange}/>
                                    </div>
                                </form>
                            </ButtonGroup>
                            <ButtonGroup className="date-filter-group">
                                <DatePicker
                                    selected={dateRange[0]}
                                    onChange={onDatePickerChange}
                                    startDate={dateRange[0]}
                                    endDate={dateRange[1]}
                                    todayButton={'Today'}
                                    showMonthDropdown={true}
                                    showYearDropdown={true}                                
                                    selectsRange
                                    isClearable
                                    placeholderText="jobs date range"
                                />                
                            </ButtonGroup>
                        </div>
                        <div className="selected-jobs-activity-bar hide-when-unselected">
                            <ButtonGroup className="selection-group">
                                <PrettyClickableDiv className="cancel-selection" onClick={onCancelSelectionClick}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="icon"/>
                                    <span>Cancel</span>                    
                                </PrettyClickableDiv>
                                <div className="selection-count">
                                    {selectedJobs.length} Selected
                                </div> 
                            </ButtonGroup>
                            <ButtonGroup className="select-all-group">                             
                                <Button className="btn-select-all" onClick={onSelectAllClick} title="select all">
                                    <FontAwesomeIcon icon={faCheckDouble} />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup className="deleting-jobs-group">
                                <Button className="btn-delete" onClick={onDeleteJobsClick}>
                                    <FontAwesomeIcon className={isDeletingJobs ? 'refreshing':''} icon={isDeletingJobs? faRefresh:faTrash } />
                                </Button>
                                <Button className="btn-delete-files" onClick={onDeleteJobsFilesClick}>
                                    {
                                        isDeletingJobsFiles ? (
                                            <FontAwesomeIcon className="refreshing" icon={faRefresh} />
                                        ) : (
                                            <span><img src={deletePDFImage} alt="delete pdf"/></span>
                                        )
                                    }
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                {jobs.length > ITEMS_PER_PAGE && (
                    <>
                        <DynamicPagination 
                            page={currentPage} 
                            itemsCount={jobs.length} 
                            onPageChange={onPaginationPageChange} 
                            itemsPerPage={ITEMS_PER_PAGE} 
                            simplePagesListLimit={SIMPLE_PAGES_LIST_LIMIT}
                        />
                        <div>Job {currentPage*ITEMS_PER_PAGE+1} to {Math.min((currentPage+1)*(ITEMS_PER_PAGE), jobs.length)}:</div>
                    </>
                )}
                <JobsList jobs={jobs.slice(currentPage*ITEMS_PER_PAGE, (currentPage+1)*ITEMS_PER_PAGE)} onSelectionChanged={onJobSelectionChanged} onJobFileDeleteRequest={onJobFileDeleteRequest} selectedJobs={selectedJobs}/>
            </Container>  
        </JobsPage>
    </ConsoleBase>
}

export default Jobs