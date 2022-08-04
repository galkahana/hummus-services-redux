import { createBrowserHistory } from 'history'
import { map } from 'lodash'


const history = createBrowserHistory({ window })


export default history


function objectToParamsString(urlParams: {[key: string]: any}) {
    return map(
        urlParams,
        (value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    ).join('&')
}
  
function paramsStringToObject(inSearch: string) {
    inSearch = inSearch.split('+').join(' ')
  
    let params: {[key: string]: string} = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g
  
    while ((tokens = re.exec(inSearch))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    }
  
    return params
}
  
export function urlWithParams(sourceUrl: string, params: {[key: string]: any}) {
    const paramsString = objectToParamsString(params)
    return sourceUrl + (paramsString ? `?${paramsString}` : '')
}
  
export function paramsFromCurrentUrl() {
    return paramsStringToObject(window.location.search)
}
  