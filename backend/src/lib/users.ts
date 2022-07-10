import { IUserInput } from '@models/users/types'
import Model from '@models/users'

export const findByUsername = (username: string) => Model.findOne({ username })
export const findByUID = (uid: string) => Model.findOne({ uid })
export const createUser = (data: IUserInput) => Model.create(data)
export const removeUserByUsername = (username: string) => Model.deleteOne({ username })
