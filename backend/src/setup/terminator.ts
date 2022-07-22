import winston from 'winston'

// safe and sure kill
// first create a generic "terminator"
const terminator = (sig: string) => {
    if (typeof sig === 'string') {
        winston.info(`Received ${sig} - terminating app ...`)
        process.exit(1)
    }
    winston.info('Node server stopped.')
}

export function setup() {
    // then implement it for every process signal related to exit/quit
    [
        'SIGHUP',
        'SIGINT',
        'SIGQUIT',
        'SIGILL',
        'SIGTRAP',
        'SIGABRT',
        'SIGBUS',
        'SIGFPE',
        'SIGUSR1',
        'SIGSEGV',
        'SIGUSR2',
        'SIGTERM'
    ].forEach(function(element) {
        process.on(element, function() {
            terminator(element)
        })
    })
}
