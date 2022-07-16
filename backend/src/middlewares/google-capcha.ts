import axios from 'axios'
import FromData from 'form-data'
import config from 'config'
import { NextFunction, Request, Response } from 'express'

const ERROR_TO_MESSAGE: Record<string, string> = {
    'missing-input-secret':'The secret parameter is missing.',
    'invalid-input-secret':'The secret parameter is invalid or malformed.',
    'missing-input-response':'The response parameter is missing.',
    'invalid-input-response':'The response parameter is invalid or malformed.'   
}

const GOOGLE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'


export async function checkCapcha(req: Request, res: Response, next: NextFunction) {
    const capchaResponse = req.headers['hmscpa']
    if(!capchaResponse) {
        const err = new Error('Missing Capcha, Try Again')
        res.locals.errInfo = { noCapcha : true }
        return next(err)
    }    

    const form = new FromData()
    form.append('secret', config.get<string>('recaptcha.secret'))
    form.append('response', capchaResponse)

    try {
        const response = await axios.post(GOOGLE_VERIFY_URL, form, { headers: form.getHeaders() })
        const responseData: {success: boolean, 'error-codes'?: string[]} = response.data
        if(responseData.success) {
            return next()
        }
        else {
            const errorCode = _firstErrorCode(responseData['error-codes'])
            res.locals.errInfo = { capchaError : errorCode ? ERROR_TO_MESSAGE[errorCode] || errorCode : null }
            return next(new Error('Capcha Error, Try Again'))
        }    
    } catch(err: unknown) {
        return next(err || new Error('Bad response, Try Again'))
    }
}

function _firstErrorCode(errorCodes?: string[]) {
    if(!errorCodes)
        return null
    if(errorCodes.length == 0)
        return null
    
    return errorCodes[0]

}
