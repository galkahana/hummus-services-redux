import mustache from 'mustache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(mustache.escape as any) = function (value: any): string 
{
    return value as string
}

export default mustache