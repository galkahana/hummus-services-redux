import config from 'config'
import winston from 'winston'
import uuid from 'node-uuid'
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import { StorageSource, UploadedFileData } from '@models/generated-files/types'


// credentials are expected to be loadeddirectly using env vars

const s3Client = new S3Client({ region: config.get<string>('aws.region') })
const defaultUploadBucketName = config.get<string>('aws.s3.uploadBucket')

export async function uploadFileToDefaultBucket(filePath: string, bucketPrefix: string): Promise<UploadedFileData> {
    const fileKey = `${bucketPrefix}/${uuid.v1()}.pdf`

    const fileStream = fs.createReadStream(filePath)

    try {
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: defaultUploadBucketName,
            Key: fileKey,
            Body: fileStream,
        }))
        winston.info('Upload succeeded', { uploadData: data })
        return {
            sourceType: StorageSource.S3,
            data: {
                remoteKey:fileKey
            }
        }
    } catch (ex) {
        winston.info('Upload failed', ex)
        throw ex
    }    

}

export async function removeFiles(files: UploadedFileData[]) {

    const keysForDelete = files.map(file => file.data.remoteKey)
    try {
        const data = await s3Client.send(new DeleteObjectsCommand({
            Bucket: defaultUploadBucketName,
            Delete: {
                Objects: keysForDelete.map(key => ({ Key:key }))
            }
        }))
        winston.info('Delete succeeded', { deleteData: data })

    } catch (ex) {
        winston.info('Delete failed', ex)
        throw ex
    }           
}