import moment from 'moment'
import { Request, Response } from 'express'
import { pick } from 'lodash'
import { body } from 'express-validator'

import { IUser } from '@models/users/types'
import { findByUID, patch as patchUser } from '@lib/users'
import { getAccumulatedSizeForJobsRan, getAccumulatedSizeForFilesDownloaded } from '@lib/accounting'
import { getTotalFolderSize } from '@lib/storage'

export async function show(req: Request<Record<string, never>, IUser>, res: Response<IUser>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. shouldnt get here')
    }    
    res.status(200).json(user)
}

type UserPatchInput = {
    email?: string
    name?: string
}

export const patch = [
    body('name').escape().optional(),
    body('email').isEmail().optional(),
    _patch
]


type PlanUsageQuery = {
    to?: string
    from?: string
}

type PlanUsageResult = {
    generation: {size: number, count: number},
    download: {size: number, count: number},
    totalStorageSize: number,
    from: Date,
    to: Date
}

export async function getPlanUsage(req: Request<Record<string, never>, null, PlanUsageResult, PlanUsageQuery>, res: Response<PlanUsageResult>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. shouldnt get here')
    }
    
    const to = req.query.to ? moment(req.query.to):moment().endOf('day')
    const toAsDate = to.toDate()
    const from = req.query.from ?  moment(req.query.to):moment(to).subtract(1, 'month') 
    const fromAsDate = from.toDate()   

    const [ totalGenerationSize, totalDownloadSize, totalStorageSize ] = await Promise.all([
        getAccumulatedSizeForJobsRan(user._id, fromAsDate, toAsDate),
        getAccumulatedSizeForFilesDownloaded(user._id, fromAsDate, toAsDate),
        getTotalFolderSize(user.uid)
    ])

    res.status(200).json({
        generation: totalGenerationSize,
        download: totalDownloadSize,
        totalStorageSize: totalStorageSize,
        from: fromAsDate,
        to: toAsDate
    })    

}

async function _patch(req: Request<Record<string, never>, IUser, UserPatchInput>, res: Response<IUser>) {
    
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. shouldnt get here')
    }    
    
    const updates = _filterValidUpdateFields(req.body)

    await patchUser(user._id, updates)
    const updated_user = await findByUID(user.uid) as IUser // result potentially could return null but we know it cant
    res.status(200).json(updated_user)
    
}

function _filterValidUpdateFields(payload: Record<string, unknown>) {
    return pick(payload, [ 'name', 'email' ])
} 