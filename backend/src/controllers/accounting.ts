import { Request, Response } from 'express'
import { getCountJobsRan } from '@lib/accounting'

export async function getTotalJobsCount(req: Request, res: Response) {
    const count = await getCountJobsRan()

    res.status(200).json({ count })
}