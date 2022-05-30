import { NextFunction, Request, Response } from 'express'

/**
 * Catch 403 and forward to error handler
 * @param req request object
 * @param res response object to decorate
 * @param next callback for error handler
 */
export default (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Decorating response object with notFound object
     * @param message message to embed in error
     */
    res.forbidden = function(message?: string) {
        const error = new Error(
            message ||
                'Access denied: you are not permitted to perform this action.'
        )
        res.errStatus = 403
        next(error)
    }
    next()
}
