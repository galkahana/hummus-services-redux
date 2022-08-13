import winston from 'winston'
import { File } from 'temporary'
import _fs from 'fs'
import { map, flatten } from 'lodash'
import axios from 'axios'

import { executeForAtMost } from '@lib/async'

const fs = _fs.promises

async function _downloadFile(source: string, targetPath: string, timeout?: number): Promise<string> {
    if(source.substring(0, 5) != 'https' && !source.startsWith('http://localhost')) // require https. allow http only for localhost
        throw new Error(`external urls should have https prefix. failing url - ${source}`)

    const file = _fs.createWriteStream(targetPath)
    const { data } = await axios.get(source, {
        responseType: 'stream',
        headers: { 'Accept': '*' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    })
    data.pipe(file)
    const returnPromise =  new Promise<string>((resolve, reject) => {
        let error: Nullable<Error> = null
        file.on('data', ()=> {
            winston.info('writing data for', source)
        })
        file.on('error', err => {
            error = err
            file.close()
            reject(err)
        })
        file.on('close', () => {
            if (!error) {
                resolve(targetPath)
            }
        })
    })

    return timeout ? executeForAtMost(returnPromise, timeout, `Downloading ${source} timedout`) : returnPromise
}

async function _downloadExternalEntry(externalKey: string, externalValue: string|string[], timeout?: number): Promise<[string, string|string[]]> {
    if(typeof externalValue == 'string') {
        const downloadedPath = await _downloadFile(externalValue, new File().path, timeout)
        winston.info('downloaded', externalKey, 'from', externalValue)
        return [ externalKey, downloadedPath ]
    }
    else if (Array.isArray(externalValue)) {
        const downloadedPaths = await Promise.all(map(externalValue, (value) => _downloadFile(value, new File().path, timeout)))
        winston.info('downloaded', externalKey, 'from', externalValue)
        return [ externalKey, downloadedPaths ]
    }
    else {
        throw new Error('Unrecognized type. externals table values can be either strings or string arrays')
    }

}

export class ExternalFiles {
    externalsMap: {[key:string]: string|string[]} = {}

    async downloadExternals(externals?: {[key:string]: string|string[]}, timeout?: number) {
        if(!externals)
            return

        const downloadResults = await Promise.all(map(externals, (value, key) => _downloadExternalEntry(key, value, timeout)))

        downloadResults.forEach((downloadResult) => {
            const [ key, value ] = downloadResult

            this.externalsMap[key] = value
        })

    }

    async removeFiles() {
        const allFiles = flatten<string>(Object.values(this.externalsMap))
        await Promise.all(map(allFiles, (value) => fs.unlink(value)))
    }
}