import { Roles } from '@lib/authorization/rbac'
import { ObjectId } from 'bson'

export interface IFileDownloadedAccountingEvent{
    _id: ObjectId // internal id
    user: ObjectId
    tokenId: string
    tokenString: string
    tokenType?: Roles
    file: ObjectId
    fileSize: number
    createdAt: Date
    updatedAt: Date
}

export type IFileDownloadedAccountingEventInput = Omit<IFileDownloadedAccountingEvent, 'createdAt'|'updatedAt'|'_id'>;