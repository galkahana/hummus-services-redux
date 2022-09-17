import config from 'config'
import { Request, Response } from 'express'

type ConfigResponse = {
    captchaSiteKey: string,
    joinEmail: string,
    supportEmail: string
}

export async function show(req: Request<Record<string, never>, ConfigResponse>, res: Response<ConfigResponse>) {
    res.status(200).json({
        captchaSiteKey: config.get('recaptcha.disabled') ? '':  config.get<string>('recaptcha.key'), 
        joinEmail: config.get<string>('emails.joinEmail'), 
        supportEmail: config.get<string>('emails.supportEmail')
    })
}