import { AxiosError } from 'axios'

export default class EnhancedError {
    ex: unknown

    constructor(ex: unknown) {
        this.ex = ex
    }

    log(logger=console) {
        if( this.ex instanceof AxiosError)
            if (this.ex.response) {
                const response = this.ex.response

                logger.error(
                    `Error Status: ${response.status}. Error Text: ${
                        this.ex.response.data
                            ? JSON.stringify(response.data, null, 2)
                            : response.statusText
                    }`,
                )
                logger.error(
                    `Error response headers: ${JSON.stringify(
                        response.headers,
                        null,
                        2,
                    )}`,
                )
            }
        if(this.ex instanceof Error)
            logger.error(this.ex.stack)
    }

    getErrorMessage(): Nullable<string> {
        if(this.ex instanceof AxiosError && this.ex.response?.data.message) {
            return this.ex.response.data.message
        }
        
        if(this.ex instanceof Error)
            return this.ex.message

        return null
    }
}

export const createEnhancedError = (ex: unknown) => new EnhancedError(ex)


