export interface TokenPayload {
    sub?: string| undefined, 
    exp?: number| undefined, 
    role?: string| undefined, 
    jti?: string| undefined, 
    refresh?: boolean| undefined
    restrictedDomains? : Nullable<string[]>
}