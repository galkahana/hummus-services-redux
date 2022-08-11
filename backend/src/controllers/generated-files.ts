import { Request, Response } from 'express'
import winston from 'winston'
import { HydratedDocument } from 'mongoose'

import { findAllDesc, findByUID, findByPublicDownloadId } from '@lib/generated-files'
import { IGeneratedFile } from '@models/generated-files/types'
import { removeFile, downloadFileToStream } from '@lib/storage'
import { enhanceResponse } from '@lib/express/enhanced-response'
import { logFileDownloadedAccountingEvent } from '@lib/accounting'
import { AuthResponse } from '@lib/express/types'
import { TokenPayload } from '@lib/tokens/types'

type ListQuery = {
    dateRangeFrom?: string
    dateRangeTo?: string
    in?: string[]
}

export async function list(req: Request<Record<string, never>, IGeneratedFile[], null, ListQuery>, res: AuthResponse<IGeneratedFile[]>) {
    const user = res.locals.user
    if (!user) {
        return res.badRequest('Missing user. should have user for identifying whose jobs are being queried')
    }
    
    // query by user
    const queryParams: {[key:string]: unknown} = {
        user:user._id
    }
    
    // add date range
    if(req.query.dateRangeFrom !== undefined ||
        req.query.dateRangeTo !== undefined) {
        const from = req.query.dateRangeFrom ? Date.parse(req.query.dateRangeFrom):null
        const to = req.query.dateRangeTo ? Date.parse(req.query.dateRangeTo):null
        
        if(to) {
            if(from) {
                // both
                queryParams.$or = [
                    {
                        $and: [
                            { createdAt: { $gte: from } },
                            { createdAt: { $lte: to } }
                        ]
                    },
                    {
                        $and: [
                            { updatedAt: { $ne : null } },
                            { updatedAt: { $gte: from } },
                            { updatedAt: { $lte: to } }
                        ]
                    }  
                ]                    
            }  
            else {
                // only to
                queryParams.$or = [
                    {
                        createdAt: { $lte: to }
                    },
                    {
                        $and: [
                            { updatedAt: { $ne : null } },
                            { updatedAt: { $lte: to } }
                        ]
                    }  
                ]                       
            }
        } else if(from) {
            // only from
            queryParams.$or = [
                {
                    createdAt: { $gte: from }
                },
                {
                    $and: [
                        { updatedAt: { $ne : null } },
                        { updatedAt: { $gte: from } }
                    ]
                }  
            ]                 
        }
    }

    // add specific ids        
    if(req.query.in !== undefined) {
        queryParams.uid = { $in:req.query.in }            
    }

    const results = await findAllDesc(queryParams)
    res.status(200).json(results)
}

export async function show(req: Request<{id: string}, IGeneratedFile|null>, res: Response<IGeneratedFile|null>) {
    if (!req.params.id) {
        return res.badRequest('Missing file id')
    }

    if (!res.locals.user) {
        return res.badRequest('Missing user. should have user for identifying whose job it is')
    }

    const file = await findByUID(req.params.id, { user: res.locals.user._id })
    res.status(200).json(file)
}

export async function remove(req: Request<{id: string}>, res: Response) {
    if (!req.params.id) {
        return res.badRequest('Missing file id')
    }
    
    if (!res.locals.user) {
        return res.badRequest('Missing user for action')
    }        

    const file = await findByUID(req.params.id, { user: res.locals.user._id })

    if (!file) {
        return res.badRequest('No record found for input id')
    }

    await _removeRemoteAndDeleteEntry(file)
    res.sendStatus(204)
}

export async function download(req: Request<{id: string}>, res: Response) {
    await _serve(req, res, true)
}

export async function embed(req: Request<{id: string}>, res: Response) {
    await _serve(req, res, false)
}

export async function downloadPublic(req: Request<{publicDownloadId: string}>, res: Response) {
    await _servePublic(req, res, true)
}

export async function embedPublic(req: Request<{publicDownloadId: string}>, res: Response) {
    await _servePublic(req, res, false)
}


async function _removeRemoteAndDeleteEntry(file: HydratedDocument<IGeneratedFile> ) {
    winston.info('Removing remote file', file.remoteSource)
    await removeFile(file.remoteSource)
    winston.info('Succeeded in removing remote file', file.remoteSource)
    await file.remove()
    winston.info('Now also removed remote file entry', file.remoteSource, 'entry ID = ', file._id)
}

async function _serve(req: Request<{id: string}>, res: Response, shouldDownload: boolean) {
    if (!req.params.id) {
        return res.badRequest('Missing file id')
    }
    
    if (!res.locals.user) {
        return res.badRequest('Missing user for action')
    }        

    if (!enhanceResponse(res).firstInfo()?.token){
        return res.badRequest('Missing token. cant bill properly. no download')
    }

    const file = await findByUID(req.params.id, { user: res.locals.user._id })

    if (!file) {
        return res.badRequest('No record found for input id')
    }

    const firstInfo = enhanceResponse(res).firstInfo()

    await _serveFileEntry(res, file, shouldDownload, firstInfo?.token, firstInfo?.tokenData)
}

async function _serveFileEntry(res: Response, fileEntry: IGeneratedFile, shouldDownload: boolean, token?: string, tokenData?: TokenPayload) {
    const targetFilename = shouldDownload ? (fileEntry.downloadTitle || fileEntry._id.toString()):null
    _setupDownloadHeader(res, targetFilename)
    const downloadSize = await downloadFileToStream(fileEntry.remoteSource, res)
    await logFileDownloadedAccountingEvent(fileEntry, downloadSize || null, token, tokenData)
}

function _setupDownloadHeader(res: Response, inWithFileName: Nullable<string>) {
    if(inWithFileName) {
        // make sure it ends with .pdf
        if(!inWithFileName.endsWith('.pdf'))
            inWithFileName+='.pdf'
        
        res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-disposition':'attachment; filename=' + encodeURIComponent(inWithFileName) })
    }
    else
        res.writeHead(200, { 'Content-Type': 'application/pdf' })
}

async function _servePublic(req: Request<{publicDownloadId: string}>, res: Response, shouldDownload: boolean) {
    if(!req.params.publicDownloadId) {
        return res.badRequest('Missing file public download id')
    }
       

    const file = await findByPublicDownloadId(req.params.publicDownloadId)

    if (!file) {
        return res.badRequest('No record public download id')
    }

    await _serveFileEntry(res, file, shouldDownload)
}