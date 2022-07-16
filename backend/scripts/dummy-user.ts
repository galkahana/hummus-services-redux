import 'dotenv/config'
import 'module-alias/register'
import winston from 'winston'

import { setup as logSetup } from '../src/lib/logging/setup'
import { generateHashPassword } from '../src/lib/passwords'
import { createUser, removeUserByUsername } from '../src/lib/users'
import { UserStatus } from '../src/models/users/types'
import database from '../src/setup/database'


async function createDummyUser() {
    logSetup()
    await database.connectTillSuccess()

    const { salt, hash, iterations }= await generateHashPassword('test')

    try {
        await createUser({
            username: 'a.a@hotmail.com',
            email: 'a.a@hotmail.com',
            name: 'a',
            salt,
            hash,
            iterations,
            status: UserStatus.Full
    
        })
    }
    catch(err: unknown) {
        if( err instanceof Error)
            winston.info(`error: ${err}`)
    }

    await database.disconnect()
}

async function removeDummyUser() {
    logSetup()
    await database.connectTillSuccess()

    try {
        await removeUserByUsername('a.a@hotmail.com')
    }
    catch(err: unknown) {
        if( err instanceof Error)
            winston.info(`error: ${err}`)
    }

    await database.disconnect()
}

const command = process.argv[process.argv.length-1] == 'remove' ? removeDummyUser : createDummyUser

command().then(()=>winston.info('Done')).catch((err: Error)=> winston.info(`error: ${err}`))