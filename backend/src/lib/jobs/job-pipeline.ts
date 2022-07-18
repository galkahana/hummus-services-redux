import winston from 'winston'
import mustache from 'mustache'
import _fs from 'fs'
import { File } from 'temporary'
import { PDFWStreamForFile } from 'hummus'
import { PDFEngine, ExternalsMap, PDFEngineDocument } from 'hummus-reports'
import uuid from 'node-uuid'

import { ExternalFiles } from './external-files'
import { ExternalsMapDriver } from './externals-map-driver'
import { Ticket } from './types'
import { localResources } from './local-resources'

const fs = _fs.promises

const promiseClose = (outputStream: PDFWStreamForFile) => new Promise((resolve)=> outputStream.close(resolve))

export class JobPipeline  {
    ticket: Ticket

    constructor(ticket: Ticket) {
        this.ticket = ticket

    }

    async run(): Promise<[outpufPath: string, outputTitle: string]> {
        const externalFiles = new ExternalFiles()
        try {
            await externalFiles.downloadExternals(this.ticket.externals)
            winston.info('done with download', { downloads: externalFiles.externalsMap })
            const ticketDocument = this._computeDocument(await this._getDocument(externalFiles.externalsMap))
            const pdfOutputPath = await this._generatePDF(ticketDocument, externalFiles.externalsMap)
            externalFiles.removeFiles() // cleanup, don't wait
            return [ pdfOutputPath, this.ticket.title || uuid.v1() ]
        }
        catch(ex) {
            externalFiles.removeFiles() // cleanup, don't wait
            throw ex
        }
    }

    async _getDocument(externalsMap: ExternalsMap): Promise<string|PDFEngineDocument> {
        if(!this.ticket.document)
            throw new Error('Ticket document entry is missing')

        if(this.ticket.document.embedded)
            return this.ticket.document.embedded

        if(this.ticket.document.referenced) {
            const filePath = new ExternalsMapDriver(externalsMap).getExternalPath(this.ticket.document.referenced)
            if(filePath) {
                return await fs.readFile(typeof filePath  == 'string' ? filePath : filePath[0], 'utf8')
            }
        }

        throw new Error('Ticket document should be either referenced or embedded. no document exists in ticket')
    }

    _computeDocument(document: string|PDFEngineDocument): PDFEngineDocument {
        if(this.ticket.variableData) {
            // document must be string data!
            // use mustache to resolve, and return document
            
            // if document is embedded object, try to convert to string            
            if(typeof document != 'string')
                throw new Error('Document is not a string. Ticket holds variable data, so document should be string.')

            const theDocumentString = typeof document == 'string' ? document: JSON.stringify(document)
            return JSON.parse(mustache.render(theDocumentString, this.ticket.variableData))
        } else {
            return typeof document == 'string' ?JSON.parse(document): document
        }
    }    

    async _generatePDF(document: PDFEngineDocument, externalsMap: ExternalsMap) {
        const writerOptions = this.ticket.document.options
        const resultPath = new File().path
        const outputStream = new PDFWStreamForFile(resultPath)

        const paths = {
            ...localResources,
            ...externalsMap
        }
        const engine = new PDFEngine(paths)
        try {
            engine.generatePDF(document, outputStream, writerOptions)
            await promiseClose(outputStream)
        } catch(ex) {
            await promiseClose(outputStream)
            throw ex
        }       
        return  resultPath
    }

}