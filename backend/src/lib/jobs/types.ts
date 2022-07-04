export interface Ticket {
    externals: {[key:string]: string|string[]}
    title: string
    meta?: {
        label?: string
        deleteFileAfter?: number
    }
}