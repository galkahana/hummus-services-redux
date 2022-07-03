import { Actions, Resources, accesscontrol } from '@lib/authorization/rbac'
import { enhanceRequest } from '@lib/enhanced-request'
import { NextFunction, Request, Response } from 'express'

export const authorizeOwn = (resource: Resources, action: Actions) => {
    return function(req: Request, res: Response, next: NextFunction) {
        const firstInfo = enhanceRequest(req).firstInfo()
        if (!firstInfo || !firstInfo.role)
            return res.forbidden()

        if(!accesscontrol.can(firstInfo.role)[`${action}Own`](resource).granted)
            return res.forbidden()
        
        return next()
    }
}