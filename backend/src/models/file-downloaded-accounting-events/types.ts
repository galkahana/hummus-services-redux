import { Roles } from '@lib/authorization/rbac'
import { ObjectId } from 'bson'

export interface IFileDownloadedAccountingEvent{
    _id: ObjectId // internal id
    user: ObjectId
    tokenId: string
    tokenString: string
    tokenType?: Roles
    downloadedFile: ObjectId
    downloadedFileSize?: number
    createdAt: Date
    updateedAt: Date
}

export type IFileDownloadedAccountingEventInput = Omit<IFileDownloadedAccountingEvent, 'createdAt'|'updateedAt'|'_id'>;