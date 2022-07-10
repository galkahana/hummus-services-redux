import { ObjectId } from 'bson'

import { IGeneratedFileInput } from '@models/generated-files/types'
import Model from '@models/generated-files'

export const findByUID = (uid: string) => Model.findOne({ uid })
export const createFile = (data: IGeneratedFileInput) => Model.create(data)
export const findAllIn = (ids: ObjectId[]) => Model.find({ _id: { $in:ids } })
export const destroyIn = (ids: ObjectId[]) => Model.deleteMany({ _id: { $in:ids } })