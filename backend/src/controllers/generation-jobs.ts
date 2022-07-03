import moment  from 'moment'
import winston from 'winston'
import { enhanceRequest } from '@lib/enhanced-request'
import { Ticket } from '@lib/jobs/types'
import { IUser } from '@models/users/types'
import {createJob, updateJobById} from '@lib/generation-jobs'
import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { JobStatus } from '@models/generation-jobs/types'
import { JobPipeline } from '@lib/jobs/job-pipeline'



export async function create(req: Request, res: Response) {
    const ticket = req.body,
        user = req.user,
        token = enhanceRequest(req).firstInfo()?.jwtDecoded



    if (!ticket) {
        return res.badRequest('Missing job data')
    }
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose job it is')
    }
    if (!token) {
        return res.badRequest('Missing token. cant bill job. no billing, no job')
    }

    let job
    try {
        job = await _startGenerationJob(ticket, user, token)
    } catch(err) {
        return res.unprocessable(String(err))
    }

    res.status(201).json(job) 
}

async function _startGenerationJob(ticket: Ticket, user: IUser, token: JwtPayload) {
    // create job entry
    const job = await createJob({
        status:JobStatus.JobInProgress,
        label:(ticket.meta && ticket.meta.label) ? ticket.meta.label:undefined,
        ticket:ticket,
        user:user._id,
        deleteFileAfter: (ticket.meta && ticket.meta.deleteFileAfter) ? ticket.meta.deleteFileAfter:undefined
    })

    const pipeline = new JobPipeline(ticket)

    const job_promise = pipeline.run()

    // in what should probably be some other mode of async job running, im not awaiting here but
    // rather thenning, so that we can return immediately, while still run the job
    job_promise.then(async ()=> {
        
        //TODO:  upload pdf

        //TODO:  create file entry (and update job with reference)

        //TODO:  ? crete public url?!?

        // update job status

        // on success, finally set the job status to done
        winston.info('Job succeeded, finished OK',job._id)
        job.status = JobStatus.JobDone

        // add killer date for file when done, if required
        if(job.deleteFileAfter) {
            job.deleteFileAt = moment().add({ms:job.deleteFileAfter}).toDate()
        }

        await updateJobById(job._id,job)

        // TODO: accounting.logJobRanAccountingEvent(job,token,generationResult.outputPath)


    }).catch(async (error: Error)=> {
        // failed, update job entry
        winston.error('Job failed in file creation stage',job._id)
        winston.errorEx(error)
        
        job.status = JobStatus.JobFailed
        await updateJobById(job._id,job)
        
        //TODO: accounting.logJobRanAccountingEvent(job,token);
    })




    return job

}