import 'dotenv/config'
import 'module-alias/register'
import winston from 'winston'

import { setup as logSetup } from '../src/lib/logging/setup'
import database from '../src/setup/database'
import { deleteTimedoutFiles } from '../src/lib/generation-jobs'


async function runMe() {
    winston.info('Starting deleting of timed out files')
    logSetup()
    await database.connectTillSuccess()
    
    try {
        await deleteTimedoutFiles()
    } catch(err: unknown) {
        if( err instanceof Error)
            winston.info(`error: ${err}`)
    }
    
    await database.disconnect()
    winston.info('Finished deleting of timed out files')
}


runMe().then(()=>winston.info('Done')).catch((err: Error)=> winston.info(`error: ${err}`))