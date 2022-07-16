import { NextFunction, Request, Response } from 'express'
/**
 * Catch 400 and forward to error handler
 * @param req request object
 * @param res response object to decorate
 * @param next callback for error handler
 */
export default (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Decorating response object with notFound object
     * @param message message to embed in error
     */
    res.badRequest = (message?: string) => {
        const err = new Error(message || 'Not Found')
        res.locals.errStatus = 400
        next(err)
    }
    next()
}
