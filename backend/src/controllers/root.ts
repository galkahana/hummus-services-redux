import readyStatus, { Status } from '@setup/ready'
import config from 'config'
import { Request, Response } from 'express'

export function health(_req: Request, res: Response) {
    res.status(200).send('hello world. I am Hummus Services and I approve this message.')
}

export function ready(_req: Request, res: Response) {
    const statusCheck = readyStatus()

    res.status(statusCheck.status == Status.pass ? 200: 503).json({[config.get<string>('service.name')]: statusCheck})

}


export function notFound(_req: Request, res: Response) {
    res.notFound('API call not found')
}
