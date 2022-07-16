import moment from 'moment'
import { Request, Response } from 'express'
import { pick } from 'lodash'
import { body } from 'express-validator'

import { IUser } from '@models/users/types'
import { findByUID, patch as patchUser } from '@lib/users'
import { getAccumulatedSizeForJobsRan, getAccumulatedSizeForFilesDownloaded } from '@lib/accounting'
import { getTotalFolderSize } from '@lib/storage'
import { AuthResponse } from '@lib/express/types'
import { generateHashPassword, verifyPassword } from '@lib/passwords'

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

enum Actions {
    ChangeUsername = 'changeUsername',
    ChangePassword = 'changePassword'
}

type ActionsBody =ActionsChangeUsername | ActionsChangePassword

type ActionsChangeUsername = {
    type: Actions.ChangeUsername,
    username: string
}

type ActionsChangePassword = {
    type: Actions.ChangePassword,
    oldPassword: string,
    newPassword: string
}


type ActionsResponse = {
    ok: boolean
}

export async function actions(req: Request<Record<string, never>, ActionsResponse, ActionsBody>, res: AuthResponse<ActionsResponse>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose jobs are being manipulated')
    }
    
    const type = req.body.type
    if(!type) {
        return res.badRequest('Missing type. should be changeUsername or changePassword')
    }
    
    switch(type) {
        case Actions.ChangeUsername: {
            const username = req.body.username
            if(!username) {
                res.badRequest('Missing username for username change')
                break
            }

            try {
                await patchUser(user._id, { username })
            } catch (err: unknown) {
                // handle duplicate username
                if(_isErrorWithCode(err) && err.code == '11000') {
                    res.locals.errInfo = { duplicateUsername: true }
                    throw new Error('A user with this username already exists')
                }

                throw err
            }

            res.status(200).json({ ok:true })
            break
        }
        case Actions.ChangePassword: {
            const oldPassword = req.body.oldPassword
            const newPassword = req.body.newPassword
            
            if(!oldPassword) {
                res.badRequest('Missing old password for password change')
                break
            }

            if(!newPassword) {
                res.badRequest('Missing new password for password change')
                break
            }

            if(!await verifyPassword({
                salt: user.salt,
                hash: user.hash,
                iterations: user.iterations
                
            }, oldPassword)) {
                res.locals.errInfo = { oldPasswordMismatch: true }
                throw new Error('old password does not match')
            }

            const { salt, hash, iterations } = await generateHashPassword(newPassword)

            await patchUser(user._id, { salt, hash, iterations })

            res.status(200).json({ ok:true })
            break
            
        }
        default: {
            res.badRequest('Unknown type. should be deleteAll')
        }
    }
    
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

interface ErrorWithCode extends Error {
    code: string
}

function _isErrorWithCode(err: unknown): err is ErrorWithCode {
    return (err instanceof Error) && (typeof (err as ErrorWithCode).code == 'string')
}