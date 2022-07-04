import { Ticket } from './types'
import {ExternalFiles} from './external-files'
import winston from 'winston'

export class JobPipeline  {
    ticket: Ticket

    constructor(ticket: Ticket) {
        this.ticket = ticket

    }

    async run() {
        const externalFiles = new ExternalFiles()
        await externalFiles.downloadExternals(this.ticket.externals)
        winston.info('done with download', {downloads: externalFiles.externalsMap})
        //const ticketDocument = computeDocument(await getDocument(externalFiles.externalsMap))
        //const pdfOutputPath = await generatePDF(ticketDocument, externalFiles.externalsMap)
        //await cleanup(externalFiles.externalsMap, pdfOutputPath)

        //return {outputPath: pdfOutputPath, outputTitle: this.ticket.title}
        
    }
}