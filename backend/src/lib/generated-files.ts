import { ObjectId } from 'bson'
import { FilterQuery } from 'mongoose'

import { IGeneratedFile, IGeneratedFileInput } from '@models/generated-files/types'
import Model from '@models/generated-files'

export const findAllDesc = (query: FilterQuery<IGeneratedFile>) => Model.find(query).sort({ createdAt:-1 })
export const findByUID = (uid: string, limitingQuery?: FilterQuery<IGeneratedFile>) => Model.findOne({
    uid,
    ...limitingQuery
})
export const findByPublicDownloadId = (publicDownloadId: string) => Model.findOne({ publicDownloadId })
export const createFile = (data: IGeneratedFileInput) => Model.create(data)
export const findAllIn = (ids: ObjectId[]) => Model.find({ _id: { $in:ids } })
export const destroyIn = (ids: ObjectId[]) => Model.deleteMany({ _id: { $in:ids } })