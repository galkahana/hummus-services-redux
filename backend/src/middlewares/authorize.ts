import { Actions, Resources, accesscontrol } from '@lib/authorization/rbac'
import { enhanceResponse } from '@lib/express/enhanced-response'
import { NextFunction, Request, Response } from 'express'

export const authorizeOwn = (resource: Resources, action: Actions) => {
    return function(_: Request, res: Response, next: NextFunction) {
        const firstInfo = enhanceResponse(res).firstInfo()
        if (!firstInfo || !firstInfo.role)
            return res.forbidden()

        if(!accesscontrol.can(firstInfo.role)[`${action}Own`](resource).granted)
            return res.forbidden()
        
        return next()
    }
}