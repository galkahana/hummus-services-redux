import { NextFunction, Request, Response } from 'express'

export default (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Decorating response object with notFound object
     * @param message message to embed in error
     */
    res.unprocessable = (message?: string) => {
        const err = new Error(message || 'Cannot process entity')
        res.locals.errStatus = 422
        next(err)
    }
    next()
}
