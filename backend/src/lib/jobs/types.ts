import { ExternalsMap, PDFEngineDocument } from 'hummus-reports'
import { WriterOptions } from 'hummus'
export interface Ticket {
    externals: ExternalsMap
    variableData: unknown // mustache view
    title: string
    meta?: {
        label?: string
        public?: boolean
        deleteFileAfter?: number // in miliseconds
    }
    document: {
        options: WriterOptions
        embedded?: string|PDFEngineDocument
        referenced?: string
    }
}