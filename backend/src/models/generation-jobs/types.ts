import { Ticket } from '@lib/jobs/types'
import { ObjectId } from 'bson'

export enum JobStatus {
    JobDone = 0,
    JobInProgress = 1,
    JobFailed = 2
}

export interface IGenerationJob {
    _id: ObjectId // internal id
    uid: string // public id
    status: JobStatus
    user: ObjectId
    label?: string
    ticket: Ticket
    deleteFileAfter?: number
    deleteFileAt?: Date
    createdAt: Date
    updateedAt: Date
    generatedFile: ObjectId
  }

export type IGenerationJobInput = Omit<IGenerationJob, 'uid'|'createdAt'|'updateedAt'|'deleteFileAt'|'generatedFile'|'_id'>;