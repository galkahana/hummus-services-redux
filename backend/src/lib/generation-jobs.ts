import { ObjectId } from 'bson'
import { AnyObject, FilterQuery } from 'mongoose'
import winston from 'winston'

import { IGenerationJob, IGenerationJobInput } from '@models/generation-jobs/types'
import * as generatedFilesService from '@lib/generated-files'
import Model from '@models/generation-jobs'
import { removeFiles } from '@lib/storage'

export const createJob = (data: IGenerationJobInput) => Model.create(data)
export const findByUID = (uid: string, limitingQuery?: FilterQuery<IGenerationJob>, populate?: boolean) => {
    const curser = Model.findOne({
        uid,
        ...limitingQuery
    })

    if(populate) {
        curser.populate('generatedFileObject')
    }

    return curser
}
export const findAllUIDsIn = (items: string[], query?: FilterQuery<IGenerationJob>) => Model.find({
    uid: { $in:items },
    ...query
})
export const findAll = (query: FilterQuery<IGenerationJob>) => Model.find(query)
export const findAllDesc = (query: FilterQuery<IGenerationJob>, populate?: boolean) => {
    const curser = Model.find(query).sort({ createdAt:-1 })

    if(populate) {
        curser.populate('generatedFileObject')
    }

    return curser
}

export const findAllIn = (ids: ObjectId[]) => Model.find({ _id: { $in:ids } })
export const destroyIn = (ids: ObjectId[]) => Model.deleteMany({ _id: { $in:ids } })
export const patchIn = (ids: ObjectId[], patch: AnyObject) => Model.updateMany({ _id: { $in:ids } }, { $set: patch })

export async function deleteAllWithFiles(items: ObjectId[]) {
    winston.info('Deleting jobs')
    await _deleteFilesForJobIDsNoUpdate(items)
    await destroyIn(items)
    winston.info('Succeeded Deleting jobs')

}

export async function deleteFilesForJobs(items: ObjectId[]) {
    winston.info('Deleting files for jobs')
    await _deleteFilesForJobIDsNoUpdate(items)
    await patchIn(items, { generatedFile: null })

    winston.info('Succeeded Deleting files for jobs')
}

export async function deleteTimedoutFiles() {

    const timedOutFilesJobs = await findAll({ deleteFileAt:{ $lte:new Date() } })

    if(!timedOutFilesJobs || timedOutFilesJobs.length == 0)
        return

    const timedOutFilesJobsIDs = timedOutFilesJobs.map( item => item._id)

    await deleteFilesForJobs(timedOutFilesJobsIDs)
    await patchIn(timedOutFilesJobsIDs, { deleteFileAt: null }) // so that it will stop showing up
    
}

async function _deleteFilesForJobIDsNoUpdate(items: ObjectId[]) {
    winston.info('Fetching job items for IDs for their file records')
    const jobs = await findAllIn(items)
    winston.info('Deleting files')
    await _deleteFilesForGeneratedFileIDs(jobs.map(jobs => jobs.generatedFile).filter((value): value is string => Boolean(value)))
    winston.info('Succeeded Deleting files')
}

async function _deleteFilesForGeneratedFileIDs(generatedFilesIDs: string[]) {
    if(generatedFilesIDs.length == 0)
        return
    /*
        Important! this one does not null geneerated file entries
    */
    const generatedFiles = await generatedFilesService.findAllUIDsIn(generatedFilesIDs)
    await removeFiles(generatedFiles.map(generatedFile => generatedFile.remoteSource))
    winston.info('Done Removing multiple files from remote storage')
    await generatedFilesService.destroyUIDsIn(generatedFilesIDs)
}

