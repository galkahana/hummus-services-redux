declare module 'history' {
    export class Location {
        state?: {
            from?: {
                pathname?: string
            }
        }
    }
}