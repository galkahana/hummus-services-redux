declare module 'hummus' {
    export class PDFWStreamForFile {
        constructor(path: string)
        close(cb: (value:unknown) => void): void
    }

    export type WriterOptions = unknown // TODO: hummus writer options
    export type WriterStream = unknown // TODO: hummus writer stream
}

