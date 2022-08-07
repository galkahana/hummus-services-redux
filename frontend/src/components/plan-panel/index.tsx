import React, { useState, useEffect } from 'react'
import moment from 'moment'
import hummusClientService from 'lib/hummus-client'
import { PlanUsageResult } from 'lib/hummus-client/types'
import { useModalAlert } from 'components/modal-alert/context'
import { Container } from 'react-bootstrap'
import Waiting from 'components/waiting/all-screen-waiting'

const DEFAULT_DATE_FILTER  = 'MMM DD, YYYY'

const bytesDisplay = (bytes: any, precision: number = 1) => {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'
    if (bytes === 0) return '0 bytes'
    var units = [ 'bytes', 'kB', 'MB', 'GB', 'TB', 'PB' ],
        number = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number]
}

const PlanPanel = () => {
    const [ planUsage, setPlanUsage ] = useState<PlanUsageResult>()

    const showModalAlert = useModalAlert()

    useEffect(() => {
        hummusClientService.getUserPlanUsage({
            to: moment().endOf('day').toDate().toString()
        }).then(
            setPlanUsage
        ).catch((ex:unknown) => {
            showModalAlert(ex instanceof Error ? ex.message : 'The was an error fetching plan usage data but it won\'t tell us what it was.', 'Plan Usage Error')
        })
    }, [ showModalAlert ])

    if(!planUsage)
        return <Waiting />


    return( <Container>
        <div className="section">
            <div className="section-title">
            Between {moment(planUsage.from).format(DEFAULT_DATE_FILTER)} and {moment(planUsage.to).format(DEFAULT_DATE_FILTER)}
            </div>    
            <div className="section-title">
                <h3>Jobs</h3>
            </div>    
            <div className="section-content">
                <div>
                Generated: {planUsage.generation.count}
                </div>
                <div>
                Total Size: {bytesDisplay(planUsage.generation.size)}
                </div>
            </div>
            <div className="section-title">
                <h3>Downloads</h3>
            </div>    
            <div className="section-content">
                <div>
                Requests: {planUsage.download.count}
                </div>
                <div>
                Total Size: {bytesDisplay(planUsage.download.size)}
                </div>
            </div>
            <div className="section-title">
                <h3>Storage</h3>
            </div>    
            <div className="section-content">
                <div>
                Total Used Space: {bytesDisplay(planUsage.totalStorageSize)}
                </div>
            </div>
        </div>
    </Container>)
}

export default PlanPanel