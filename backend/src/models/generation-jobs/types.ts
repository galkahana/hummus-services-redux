import { Ticket } from '@lib/jobs/types'
import { IGeneratedFile } from '@models/generated-files/types'
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
    statusMessage?: string
    user: ObjectId
    label?: string
    ticket: Ticket
    deleteFileAt?: Date
    finishedAt?: Date
    createdAt: Date
    updatedAt: Date
    generatedFile?: string 
    generatedFileObject?: IGeneratedFile
  }

export type IGenerationJobInput = Omit<IGenerationJob, 'uid'|'createdAt'|'updatedAt'|'deleteFileAt'|'finishedAt'|'generatedFile'|'generatedFileObject'|'_id'>;