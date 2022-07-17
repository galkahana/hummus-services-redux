import 'dotenv/config'
import 'module-alias/register'
import winston from 'winston'
import config from 'config'

import { sendTestEmail } from '../src/lib/emails'

import { setup as logSetup } from '../src/lib/logging/setup'

async function testEmail() {
    logSetup()
    

    try {
        const result = await sendTestEmail(config.get<string>('emails.supportEmail'), config.get<string>('emails.joinEmail'))
        winston.info(result)
    }
    catch(err: unknown) {
        if( err instanceof Error)
            winston.info(`error: ${err}`)
    }
}

const command = testEmail
command().then(()=>winston.info('Done')).catch((err: Error)=> winston.info(`error: ${err}`))