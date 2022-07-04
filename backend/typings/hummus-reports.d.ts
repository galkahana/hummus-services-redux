declare module 'hummus-reports' {
    export class PDFEngine {
        constructor(paths: ExternalsMap)
        generatePDF(document: PDFEngineDocument, outputStream: import('hummus').WriterStream, writerOptions: import('hummus').WriterOptions): void
    }

    export type ExternalsMap = {[key:string]: string|string[]}

    export interface PDFEngineDocument {
        dummy: string
    }
    
}

