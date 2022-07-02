import { Request, Response } from 'express'

export function create(_req: Request, res: Response) {
    // DUMMY
    res.status(201).send('Job created!')
}