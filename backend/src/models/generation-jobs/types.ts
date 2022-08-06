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
    deleteFileAt?: Date
    createdAt: Date
    updatedAt: Date
    generatedFile?: ObjectId
  }

export type IGenerationJobInput = Omit<IGenerationJob, 'uid'|'createdAt'|'updatedAt'|'deleteFileAt'|'generatedFile'|'_id'>;