import { NextFunction, Request, Response } from 'express'

/**
 * Catch 401 and forward to error handler
 * @param req request object
 * @param res response object to decorate
 * @param next callback for error handler
 */
export default (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Decorating response object with notFound object
     * @param message message to embed in error
     */
    res.unauthenticated = function(message?: string) {
        const err = new Error(message || 'Not Found')
        res.errStatus = 401
        next(err)
    }
    next()
}
