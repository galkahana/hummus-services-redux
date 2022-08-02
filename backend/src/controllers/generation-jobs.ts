import * as crypto from 'crypto'
import moment  from 'moment'
import winston from 'winston'
import { Request, Response } from 'express'
import _fs from 'fs'

import { ObjectId } from 'bson'

import { enhanceResponse } from '@lib/express/enhanced-response'
import { Ticket } from '@lib/jobs/types'
import { IUser } from '@models/users/types'
import { createJob, findAllDesc, findAllUIDsIn, findAll, deleteAllWithFiles, deleteFilesForJobs, findByUID } from '@lib/generation-jobs'
import { createFile } from '@lib/generated-files'
import { JobStatus, IGenerationJob } from '@models/generation-jobs/types'
import { JobPipeline } from '@lib/jobs/job-pipeline'
import { uploadFileToDefaultBucket } from '@lib/storage'
import { UploadedFileData } from '@models/generated-files/types'
import { logJobRanAccountingEvent } from '@lib/accounting'
import { TokenPayload } from '@lib/tokens/types'
import { AuthResponse } from '@lib/express/types'

import { OKResponse } from '@middlewares/responses/200'

const fs = _fs.promises

export async function create(req: Request<Record<string, never>, IGenerationJob, Ticket>, res: Response<IGenerationJob>) {
    const ticket = req.body // TODO: ticket should probably go through some sort of sanitation...especially the document part
    const user = res.locals.user
    const requestInfo = enhanceResponse(res).firstInfo()
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

type ListQuery = {
    searchTerm?: string
    dateRangeFrom?: string
    dateRangeTo?: string
    in?: string[]
}

export async function list(req: Request<Record<string, never>, IGenerationJob[], null, ListQuery>, res: Response<IGenerationJob[]>) {
    const user = res.locals.user

    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose jobs are being queried')
    }

    // query by user
    const queryParams: {[key:string]: unknown} = {
        user:user._id
    }

    // add search term for title
    if(req.query.searchTerm !== undefined) {
        queryParams.label =  { $regex: `.*${req.query.searchTerm}.*`, $options:'i' }
    }

    if(req.query.dateRangeFrom !== undefined ||
        req.query.dateRangeTo !== undefined) {
        const from = req.query.dateRangeFrom ? moment(req.query.dateRangeFrom).toDate():null
        const to = req.query.dateRangeTo ? moment(req.query.dateRangeTo).toDate():null
        
        if(to) {
            if(from) {
                // both
                queryParams.$or = [
                    {
                        $and: [
                            { createdAt: { $gte: from } },
                            { createdAt: { $lte: to } }
                        ]
                    },
                    {
                        $and: [
                            { updatedAt: { $ne : null } },
                            { updatedAt: { $gte: from } },
                            { updatedAt: { $lte: to } }
                        ]
                    }  
                ]                    
            }  
            else {
                // only to
                queryParams.$or = [
                    {
                        createdAt: { $lte: to }
                    },
                    {
                        $and: [
                            { updatedAt: { $ne : null } },
                            { updatedAt: { $lte: to } }
                        ]
                    }  
                ]                       
            }
        } else if(from) {
            // only from
            queryParams.$or = [
                {
                    createdAt: { $gte: from }
                },
                {
                    $and: [
                        { updatedAt: { $ne : null } },
                        { updatedAt: { $gte: from } }
                    ]
                }  
            ]                 
        }
    }

    // add specific ids        
    if(req.query.in !== undefined) {
        queryParams.uid = { $in:req.query.in }            
    }

    const results = await findAllDesc(queryParams)
    res.status(200).json(results)
}

type ShowQuery = {
    full?: boolean
}

export async function show(req: Request<{id: string}, IGenerationJob|null, null, ShowQuery>, res: Response<IGenerationJob|null>) {
    if (!req.params.id) {
        return res.badRequest('Missing job id')
    }

    if (!res.locals.user) {
        return res.badRequest('Missing user. should have user for identifying whose job it is')
    }

    const job = await findByUID(req.params.id, { user: res.locals.user._id }, Boolean(req.query.full))
    res.status(200).json(job)
}

type ItemsBody = {
    items?: string[]
}

export async function deleteJobs(req: Request<Record<string, never>, OKResponse, ItemsBody>, res: AuthResponse<OKResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose jobs are being manipulated')
    }

    await deleteAllWithFiles(await _limitToUserJobs(user._id, req.body.items))

    res.ok()
}

export async function deleteFiles(req: Request<Record<string, never>, OKResponse, ItemsBody>, res: AuthResponse<OKResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose jobs are being manipulated')
    }

    await deleteFilesForJobs(await _limitToUserJobs(user._id, req.body.items))
    
    res.ok()
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

async function _startGenerationJob(ticket: Ticket, user: IUser, token: string, tokenData: TokenPayload) {
    // create job entry
    const job = await createJob({
        status:JobStatus.JobInProgress,
        label:(ticket.meta && ticket.meta.label) ? ticket.meta.label:undefined,
        ticket:ticket,
        user:user._id,
    })

    const pipeline = new JobPipeline(ticket)

    const job_promise = pipeline.run()

    // trigger files creation job and on it's async finish complete with activities till job can be marked as done. need to make it properly async/other service sometime
    job_promise.then(async ([ outputPath, outputTitle ])=> {
        winston.info(`Generated pdf with title ${outputTitle}. pdf file in ${outputPath}`)
        
        try {
            // Upoad file
            const uploadFileData = await _uploadFileForUser(outputPath, user)

            const resultFileSize = await _getFileSize(outputPath)

            // Create uploaded file record
            const generatedFile = await _createGeneratedFileRecord(uploadFileData, resultFileSize, outputTitle, user, Boolean(ticket?.meta?.public), token)

            
            // Job data updates
            job.generatedFile = generatedFile._id
            job.status = JobStatus.JobDone
            if(ticket.meta && ticket.meta.deleteFileAfter) {
                // setting job delete time from when job is actually finished...which is now
                job.deleteFileAt = moment().add({ ms:ticket.meta.deleteFileAfter }).toDate()
            }
            job.save()

            winston.info('Job succeeded, finished OK', job._id)

            // accounting
            await logJobRanAccountingEvent(job, token, tokenData, resultFileSize)

            // cleanup temp file (after accounting record! so can read the file size!)
            await fs.unlink(outputPath)

        } catch(ex: unknown) {
            winston.info(`Failed post job activities with job ${job._id}`)
            winston.errorEx(ex)

            // set job status to failure
            job.status = JobStatus.JobFailed
            job.save()

            // accounting
            await logJobRanAccountingEvent(job, token, tokenData)

            // cleanup temp file
            await fs.unlink(outputPath)
        }

    }).catch(async (error: Error)=> {
        // failed, update job entry
        winston.error('Job failed in file creation stage', job._id)
        winston.errorEx(error)
        
        // set job status to failure
        job.status = JobStatus.JobFailed
        job.save()
        
        // accounting
        await logJobRanAccountingEvent(job, token, tokenData)
    })

    return job
}

async function _getFileSize(filePath: string) {
    let resultFileSize: number
    try {
        const stats = await fs.stat(filePath)
        resultFileSize = stats.size
    } catch (ex) {
        winston.info(`Error, could not evaluate generated file size for file ${filePath}. defaulting to 0. error = ${ex}`)
        resultFileSize = 0
    }
    return resultFileSize
}

function _uploadFileForUser(filePath: string, user: IUser) {
    return uploadFileToDefaultBucket(filePath, user.uid)
}

async function _createGeneratedFileRecord(uploadFileData: UploadedFileData, outputFileSize: number, outputTitle: string, user: IUser, shouldCreatePublicId: boolean, creatorToken: string) {
    const generatedFile = await createFile({
        downloadTitle: outputTitle,
        remoteSource: uploadFileData,
        user: user._id,
        fileSize: outputFileSize
    })

    if(shouldCreatePublicId) {
        const publicDownloadId = _encodeBase64SafeForUrl(_hashMe(generatedFile._id.toString()) + 
                                _hashMe(moment().format()) + 
                                _hashMe(creatorToken))
        generatedFile.publicDownloadId = publicDownloadId
        await generatedFile.save()
    }

    return generatedFile
}

function _hashMe(value: string) {
    return crypto.createHash('sha256').update(value).digest('base64')
}

function _encodeBase64SafeForUrl(value: string) {
    return value.replaceAll('+', '.').replaceAll('/', '_').replaceAll('=', '-')
}

async function _limitToUserJobs(userId: ObjectId, items?: string[]) {
    const results = await (items ? findAllUIDsIn(items, { user: userId }): findAll({ user: userId }))
    return results.map(job => job._id)
}