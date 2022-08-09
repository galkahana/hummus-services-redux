import axios from 'axios'
import FromData from 'form-data'
import config from 'config'

const ERROR_TO_MESSAGE: Record<string, string> = {
    'missing-input-secret':'The secret parameter is missing.',
    'invalid-input-secret':'The secret parameter is invalid or malformed.',
    'missing-input-response':'The response parameter is missing.',
    'invalid-input-response':'The response parameter is invalid or malformed.'   
}

const GOOGLE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

type CaptchaError = {
    err: unknown,
    errInfo?: object,
    errStatus?: number
}

export async function checkCaptcha(captchaResponse: string | string[] | undefined): Promise<Nullable<CaptchaError>> {
    if(!captchaResponse) {
        return { // return error data
            err: new Error('Missing Captcha, Try Again'),
            errInfo: { noCaptcha : true },
            errStatus: 400
        }
    }    

    const form = new FromData()
    form.append('secret', config.get<string>('recaptcha.secret'))
    form.append('response', captchaResponse)

    try {
        const response = await axios.post(GOOGLE_VERIFY_URL, form, { headers: form.getHeaders() })
        const responseData: {success: boolean, 'error-codes'?: string[]} = response.data
        if(responseData.success) {
            return null // all good
        }
        else {
            const errorCode = _firstErrorCode(responseData['error-codes'])
            return { // return error data
                err: new Error('Captcha Error, Try Again'),
                errInfo: { captchaError : errorCode ? ERROR_TO_MESSAGE[errorCode] || errorCode : null },
                errStatus: 400
            }
        }    
    } catch(err: unknown) {
        return { // return error data
            err: err || new Error('Bad response, Try Again'),
        }        
    }
}

function _firstErrorCode(errorCodes?: string[]) {
    if(!errorCodes)
        return null
    if(errorCodes.length == 0)
        return null
    
    return errorCodes[0]

}
