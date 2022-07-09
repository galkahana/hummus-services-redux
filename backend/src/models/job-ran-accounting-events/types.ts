import { Roles } from '@lib/authorization/rbac'
import { JobStatus } from '@models/generation-jobs/types'
import { ObjectId } from 'bson'

export interface IJobRanAccountingEvent{
    _id: ObjectId // internal id
    user: ObjectId
    tokenId: string
    tokenString: string
    tokenType?: Roles
    job: ObjectId
    jobStatus: JobStatus
    resultFile?: ObjectId
    resultFileSize?: number
    createdAt: Date
    updateedAt: Date
}

export type IJobRanAccountingEventInput = Omit<IJobRanAccountingEvent, 'createdAt'|'updateedAt'|'_id'>;