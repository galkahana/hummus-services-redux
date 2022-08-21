type Nullable<T> = T | null
declare module '*.md';

type HummusConfigType = {
    captchaSiteKey?: string
    joinEmail?: string
    supportEmail?: string
    noBackend?: boolean
    githubProjectUrl?: string
}

declare var hummusConfig: HummusConfigType?
