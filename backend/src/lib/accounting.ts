import _fs from 'fs'
import { JwtPayload } from 'jsonwebtoken'
import { pick } from 'lodash'
import { Model } from 'mongoose'

import { IGenerationJob } from '@models/generation-jobs/types'
import JobRanAccountingEventModel from '@models/job-ran-accounting-events'
import FileDownloadedAccountingEventModel from '@models/file-downloaded-accounting-events'
import winston from 'winston'
import { IGeneratedFile } from '@models/generated-files/types'
import { ObjectID } from 'bson'

const fs = _fs.promises

export async function logJobRanAccountingEvent(job: IGenerationJob, token: string, tokenData: JwtPayload, filePath?: string) {

    let resultFileSize = null
    if(filePath) {
        try {
            const stats = await fs.stat(filePath)
            resultFileSize = stats.size
        } catch (ex) {
            winston.info(`Error, could not evaluate generated file size for file ${filePath}. defaulting to 0. error = ${ex}`)
            resultFileSize = 0
        }
    }

    return JobRanAccountingEventModel.create({
        user: job.user,
        tokenId: tokenData.jti,
        tokenString: token,
        tokenType: tokenData.role,
        job: job._id,
        jobStatus: job.status,
        resultFile: job.generatedFile,
        resultFileSize
    })
}

export function logFileDownloadedAccountingEvent(file: IGeneratedFile, token: string, tokenData: JwtPayload, fileSize: Nullable<number>) {
    return FileDownloadedAccountingEventModel.create({
        user: file.user,
        tokenId: tokenData.jti,
        tokenString: token,
        tokenType: tokenData.role,
        downloadedFile: file._id,
        downloadedFileSize: fileSize,
    })    
}


export function getAccumulatedSizeForJobsRan(userId: ObjectID, startDate: Date, endDate: Date) {
    return _aggregateSizePerModel(JobRanAccountingEventModel, userId, startDate, endDate)

}

export function getAccumulatedSizeForFilesDownloaded(userId: ObjectID, startDate: Date, endDate: Date) {
    return _aggregateSizePerModel(JobRanAccountingEventModel, userId, startDate, endDate)
}


// Note: original computation excluded site user token types to drop any tests within the playground...not trust worthy enough...
export async function _aggregateSizePerModel<T>(model: Model<T>, userId: ObjectID, startDate: Date, endDate: Date): Promise<{count: number, size: number}> {
    const results = await model.aggregate(
        [
            {
                $match:{
                    user:userId,
                    $and: [
                        { createdAt: { $gte: startDate } },
                        { createdAt: { $lte: endDate } }
                    ]
                }
            },
            {
                $group:{
                    _id:'$user',
                    count:{ $sum:1 },
                    size:{ $sum:'$resultFileSize' }
                }
            }
        ] 
    )

    return results.length > 0 ? pick(results[0], [ 'count', 'size' ]) : { count:0, size: 0 }
}    