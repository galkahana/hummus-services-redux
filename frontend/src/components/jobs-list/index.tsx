import React from 'react'

import { GenerationJobResponse } from 'lib/hummus-client/types'
import { UnstyledList } from 'components/common.styles'
import JobItem, { JobItemProps } from 'components/job-item'
import { JobsListRoot } from './jobs-list.styles'

type JobsListProps = {
    jobs: GenerationJobResponse[]
    onSelectionChanged: JobItemProps['onSelectionChanged']
    onJobFileDeleteRequest: JobItemProps['onJobFileDeleteRequest']
    selectedJobs: GenerationJobResponse[]
}

const JobsList = ({ jobs, onSelectionChanged, onJobFileDeleteRequest, selectedJobs }: JobsListProps) => {

    return <JobsListRoot className="jobs-list">
        <UnstyledList>
            {
                jobs.map((job) => (
                    <li className="jobItem" key={job.uid}>
                        <JobItem job={job} onSelectionChanged={onSelectionChanged} onJobFileDeleteRequest={onJobFileDeleteRequest} selected={selectedJobs.includes(job)} />
                    </li>
                ))   
            }
        </UnstyledList>
    </JobsListRoot>
}

export default JobsList