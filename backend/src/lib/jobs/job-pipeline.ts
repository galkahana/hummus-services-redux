import { sleep } from '@lib/async'
import { Ticket } from './types'

export class JobPipeline  {
    ticket: Ticket

    constructor(ticket: Ticket) {
        this.ticket = ticket

    }

    async run() {
        await sleep(10000)
    }
}