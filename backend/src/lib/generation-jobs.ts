import { IGenerationJob, IGenerationJobInput } from '@models/generation-jobs/types'
import Model from '@models/generation-jobs'
import { ObjectId } from 'bson'

export const findByUID = (uid: string) => Model.findOne({uid})
export const createJob = (data: IGenerationJobInput) => Model.create(data)
export const updateJobById = (id: ObjectId, data: IGenerationJob) => Model.updateOne({_id: id}, data)