import { pick } from 'lodash'
import { Model } from 'mongoose'

import { IGenerationJob } from '@models/generation-jobs/types'
import JobRanAccountingEventModel from '@models/job-ran-accounting-events'
import FileDownloadedAccountingEventModel from '@models/file-downloaded-accounting-events'
import { IGeneratedFile } from '@models/generated-files/types'
import { TokenPayload } from './tokens/types'
import { ObjectID } from 'bson'

export async function logJobRanAccountingEvent(job: IGenerationJob, file: Nullable<IGeneratedFile>, token: string, tokenData: TokenPayload, fileSize?: number) {

    return JobRanAccountingEventModel.create({
        user: job.user,
        job: job._id,
        jobStatus: job.status,
        tokenId: tokenData.jti,
        tokenString: token,
        tokenType: tokenData.role,
        file: file && file._id,
        fileSize
    })
}

export function logFileDownloadedAccountingEvent(file: IGeneratedFile, fileSize: Nullable<number>, token?: string, tokenData?: TokenPayload) {
    return FileDownloadedAccountingEventModel.create({
        user: file.user,
        tokenId: tokenData && tokenData.jti,
        tokenString: token,
        tokenType: tokenData && tokenData.role,
        file: file._id,
        fileSize
    })    
}


export function getAccumulatedSizeForJobsRan(userId: ObjectID, startDate: Date, endDate: Date) {
    return _aggregateSizePerModel(JobRanAccountingEventModel, userId, startDate, endDate)

}

export function getAccumulatedSizeForFilesDownloaded(userId: ObjectID, startDate: Date, endDate: Date) {
    return _aggregateSizePerModel(FileDownloadedAccountingEventModel, userId, startDate, endDate)
}

export function getCountJobsRan() {
    return JobRanAccountingEventModel.count()
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
                    size:{ $sum:'$fileSize' }
                }
            }
        ] 
    )

    return results.length > 0 ? pick(results[0], [ 'count', 'size' ]) : { count:0, size: 0 }
}    