import { ExternalsMap } from 'hummus-reports'

type ExternalDef = {
    name: string,
    origin: string
}

export class ExternalsMapDriver {
    externalsMap: ExternalsMap

    constructor(externalsMap: ExternalsMap) {
        this.externalsMap = externalsMap
    }

    getExternalPath(external?: string|ExternalDef) {
        if (typeof external == 'string') {
            external = {
                name: external,
                origin: 'external',
            }
        }

        if (!external) return null

        return this.externalsMap[external.name]
    }    
}