declare module 'hummus' {
    export enum ePDFVersion {
        ePDFVersion10 = 10,
        ePDFVersion11 = 11,
        ePDFVersion12 = 12,
        ePDFVersion13 = 13,
        ePDFVersion14 = 14,
        ePDFVersion15 = 15,
        ePDFVersion16 = 16,
        ePDFVersion17 = 17
    }
    export class PDFWStreamForFile {
        constructor(path: string)
        write(inArrayOfBytes: Uint8Array): number
        getCurrentPosition(): number
        close(cb: (value:unknown) => void): void
    }

    export type WriterOptions = {
        version?: ePDFVersion
        compress?: boolean
        log?: string
    }
    export interface WriterStream {
        write(inArrayOfBytes: Uint8Array): number
        getCurrentPosition(): number
    }
}

