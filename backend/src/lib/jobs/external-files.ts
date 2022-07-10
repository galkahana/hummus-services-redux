import winston from 'winston'
import { File } from 'temporary'
import _fs from 'fs'
import { map, flatten } from 'lodash'
import axios from 'axios'

const fs = _fs.promises

async function _downloadFile(source: string, targetPath: string): Promise<string> {
    if(source.substring(0,5) != 'https')
        throw new Error(`external urls should have https prefix. failing url - ${source}`)

    const file = _fs.createWriteStream(targetPath)
    const { data } = await axios.get(source, {
        responseType: 'stream'
    })
    data.pipe(file)
    await new Promise(resolve => file.on('finish', resolve))
    file.close()
    return targetPath
}

async function _downloadExternalEntry(externalKey: string, externalValue: string|string[]): Promise<[string, string|string[]]> {
    if(typeof externalValue == 'string') {
        const downloadedPath = await _downloadFile(externalValue, new File().path)
        winston.info('downloaded',externalKey,'from',externalValue)
        return [ externalKey, downloadedPath ]
    }
    else if (Array.isArray(externalValue)) {
        const downloadedPaths = await Promise.all(map(externalValue, (value) => _downloadFile(value, new File().path)))
        winston.info('downloaded',externalKey,'from',externalValue)
        return [ externalKey, downloadedPaths ]
    }
    else {
        throw new Error('Unrecognized type. externals table values can be either strings or string arrays')
    }

}

export class ExternalFiles {
    externalsMap: {[key:string]: string|string[]} = {}

    async downloadExternals(externals?: {[key:string]: string|string[]}) {
        if(!externals)
            return

        const downloadResults = await Promise.all(map(externals, (value, key) => _downloadExternalEntry(key, value)))

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