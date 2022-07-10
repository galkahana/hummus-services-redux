import { ObjectId } from 'bson'
import {FilterQuery} from 'mongoose'

import { IGenerationJob, IGenerationJobInput } from '@models/generation-jobs/types'
import Model from '@models/generation-jobs'

export const findByUID = (uid: string) => Model.findOne({uid})
export const createJob = (data: IGenerationJobInput) => Model.create(data)
export const updateJobById = (id: ObjectId, data: IGenerationJob) => Model.updateOne({_id: id}, data)

export const findAllDesc = (query: FilterQuery<IGenerationJob>) => Model.find(query).sort({createdAt:-1})