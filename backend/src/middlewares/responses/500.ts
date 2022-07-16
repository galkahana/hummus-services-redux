import { NextFunction, Request, Response } from 'express'

export default (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Decorating response object with notFound object
     * @param message message to embed in error
     */
    res.serverError = function(message?: string) {
        const err = new Error(message || 'Internal server error')
        res.locals.errStatuss = 500
        next(err)
    }
    next()
}
