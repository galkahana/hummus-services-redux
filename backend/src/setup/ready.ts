import database from './database'

export enum Status {
    pass = 'pass',
    fail = 'fail'
}

interface StatusDetails {
    status: Status,
    output: string
}

export default function readyStatus() {
    const details: {[key:string]: StatusDetails} = {}

    if(!database.connected) {
        details['db'] = {
            'status': Status.fail,
            'output': 'Failed to connect to the DB'
        }
    }

    const status = Object.values(details).some((item: StatusDetails)=> item.status == Status.fail) ? Status.fail : Status.pass
    const output = status == Status.pass ? 'all is good' : 'there\'s a problem'

    return {
        status,
        output,
        details
    }
}