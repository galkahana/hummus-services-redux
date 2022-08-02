import { NextFunction, Request, Response } from 'express'


export type OKResponse = {
    ok: boolean
}

/**
 * Reusable 200 response
 * @param _req request object
 * @param res response object to decorate
 * @param next callback for error handler
 */
export default (_req: Request, res: Response<OKResponse>, next: NextFunction) => {
    res.ok = () => {
        res.status(200).json({ ok:true })
        next()
    }
    next()
}