import mustache from 'mustache'

(mustache.escape as any) = function (value: any): string 
{
    return value as string
}

export default mustache