import _fs from 'fs'
import { JwtPayload } from 'jsonwebtoken'

import { IGenerationJob } from '@models/generation-jobs/types'
import JobRanAccountingEventModel from '@models/job-ran-accounting-events'
import FileDownloadedAccountingEventModel from '@models/file-downloaded-accounting-events'
import winston from 'winston'
import { IGeneratedFile } from '@models/generated-files/types'

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