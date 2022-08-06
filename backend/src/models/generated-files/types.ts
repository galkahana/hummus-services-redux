import { ObjectId } from 'bson'

export enum StorageSource {
    S3 = 1,
}

export interface UploadedFileData {
    sourceType: StorageSource,
    data: {
        remoteKey: string
    }
}


export interface IGeneratedFile {
    _id: ObjectId // internal id
    uid: string // public id
    user: ObjectId
    downloadTitle: string
    publicDownloadId?: string
    remoteSource: UploadedFileData
    fileSize: number
    createdAt: Date
    updatedAt: Date
  }

export type IGeneratedFileInput = Omit<IGeneratedFile, 'uid'|'createdAt'|'updatedAt'|'_id'>;