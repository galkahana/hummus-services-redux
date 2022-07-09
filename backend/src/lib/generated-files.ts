import { IGeneratedFileInput } from '@models/generated-files/types'

import Model from '@models/generated-files'

export const findByUID = (uid: string) => Model.findOne({uid})
export const createFile = (data: IGeneratedFileInput) => Model.create(data)