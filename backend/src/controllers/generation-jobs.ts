import * as crypto from 'crypto'
import moment  from 'moment'
import winston from 'winston'
import { Request, Response } from 'express'
import _fs from 'fs'

import { enhanceRequest } from '@lib/enhanced-request'
import { Ticket } from '@lib/jobs/types'
import { IUser } from '@models/users/types'
import {createJob, updateJobById} from '@lib/generation-jobs'
import { createFile } from '@lib/generated-files'
import { JobStatus } from '@models/generation-jobs/types'
import { JobPipeline } from '@lib/jobs/job-pipeline'
import { uploadFileToDefaultBucket } from '@lib/storage'
import { UploadedFileData } from '@models/generated-files/types'
import { logJobRanAccountingEvent } from '@lib/accounting'
import { JwtPayload } from 'jsonwebtoken'

const fs = _fs.promises

export async function create(req: Request, res: Response) {
    const ticket: Ticket = req.body // TODO: ticket should probably go through some sort of sanitation...especially the document part
    const user = req.user
    const requestInfo = enhanceRequest(req).firstInfo()
    const token = requestInfo?.token
    const tokenData = requestInfo?.tokenData


    if (!ticket) {
        return res.badRequest('Missing job data')
    }
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose job it is')
    }
    if (!token || !tokenData) {
        return res.badRequest('Missing token. cant bill job. no billing, no job')
    }

    let job
    try {
        job = await _startGenerationJob(ticket, user, token, tokenData)
    } catch(err) {
        return res.unprocessable(String(err))
    }

    res.status(201).json(job) 
}

/**
 * This method has all the job process defined in it. I might want to do a better job in making it properly async job if there'
 * such a thing. sometime in the future move this to another service so this service is free for handling the incoming API.
 * Also...there's a jobpipeline instance for running the job till file creation and then code here to complement it with uploading
 * and recording job result. not sure why the split is important. probably used to be cause the file creation was part of the project
 * code...but now it's now anyways...so what's the point. and maybe also desribe it as a true pipeline with activities as "mws". so the code
 * might be clearer.
 * @param ticket 
 * @param user 
 * @param token 
 * @param tokenData 
 * @returns 
 */

async function _startGenerationJob(ticket: Ticket, user: IUser, token: string, tokenData: JwtPayload) {
    // create job entry
    const job = await createJob({
        status:JobStatus.JobInProgress,
        label:(ticket.meta && ticket.meta.label) ? ticket.meta.label:undefined,
        ticket:ticket,
        user:user._id,
    })

    const pipeline = new JobPipeline(ticket)

    const job_promise = pipeline.run()

    // trigger files creation job and on it's async finish complete with activities till job can be marked as done
    job_promise.then(async ([outputPath, outputTitle])=> {
        winston.info(`Generated pdf with title ${outputTitle}. pdf file in ${outputPath}`)
        
        try {
            // Upoad file
            const uploadFileData = await _uploadFileForUser(outputPath, user)

            // Create uploaded file record
            const generatedFile = await _createGeneratedFile(uploadFileData, outputTitle, user, !ticket.meta || !ticket.meta.private, token)

            
            // Job data updates
            job.generatedFile = generatedFile._id
            job.status = JobStatus.JobDone
            if(ticket.meta && ticket.meta.deleteFileAfter) {
                // setting job delete time from when job is actually finished...which is now
                job.deleteFileAt = moment().add({ms:ticket.meta.deleteFileAfter}).toDate()
            }
            await updateJobById(job._id,job)

            winston.info('Job succeeded, finished OK',job._id)

            // accounting
            await logJobRanAccountingEvent(job, token, tokenData, outputPath)

            // cleanup temp file (after accounting record! so can read the file size!)
            await fs.unlink(outputPath)

        } catch(ex: unknown) {
            winston.info(`Failed post job activities with job ${job._id}`)
            winston.errorEx(ex)

            // set job status to failure
            job.status = JobStatus.JobFailed
            await updateJobById(job._id,job)

            // accounting
            await logJobRanAccountingEvent(job, token, tokenData)

            // cleanup temp file
            await fs.unlink(outputPath)
        }

    }).catch(async (error: Error)=> {
        // failed, update job entry
        winston.error('Job failed in file creation stage',job._id)
        winston.errorEx(error)
        
        // set job status to failure
        job.status = JobStatus.JobFailed
        await updateJobById(job._id,job)
        
        // accounting
        await logJobRanAccountingEvent(job, token, tokenData)
    })

    return job
}

function _uploadFileForUser(filePath: string, user: IUser) {
    return uploadFileToDefaultBucket(filePath, user.uid)
}

async function _createGeneratedFile(uploadFileData: UploadedFileData, outputTitle: string, user: IUser, shouldCreatePublicId: boolean, creatorToken: string) {
    const generatedFile = await createFile({
        downloadTitle: outputTitle,
        remoteSource: uploadFileData,
        user: user._id
    })

    if(shouldCreatePublicId) {
        const publicDownloadId = _hashMe(generatedFile._id.toString()) + 
                                _hashMe(moment().format()) + 
                                _hashMe(creatorToken)
        generatedFile.publicDownloadId = publicDownloadId
        await generatedFile.save()
    }

    return generatedFile
}

function _hashMe(value: string) {
    return crypto.createHash('sha256').update(value).digest('base64')
}