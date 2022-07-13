import { Request, Response } from 'express'
import { pick } from 'lodash'
import { body, check } from 'express-validator'

import { IUser } from '@models/users/types'
import { findByUID, patch as patchUser } from '@lib/users'

export async function show(req: Request<Record<string, never>, IUser>, res: Response<IUser>) {
    const user = req.user
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

async function _patch(req: Request<Record<string, never>, IUser, UserPatchInput>, res: Response<IUser>) {
    
    const user = req.user
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