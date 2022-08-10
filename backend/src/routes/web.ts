import express, { Request, Response, Express } from 'express'
import path from 'path'
import config from 'config'

const router = express.Router()

export const WEB_PATH = path.join(__dirname, '../../frontend-build')

function sendSiteFileFunc(pathToPage: string) {
    return function(_req: Request, res: Response) {
        res.sendFile(pathToPage, {
            root: WEB_PATH
        })
    }
}

export function setup(app: Express) {
    app.use(express.static(WEB_PATH))
}
 
// The client runtime config file
router.get('/config.js', (_: Request, response: Response) => {
    response.render('config.js.mustache', {
        captchaSiteKey: config.get('recaptcha.disabled') ? '':  config.get<boolean>('recaptcha.key'), 
        joinEmail: config.get<string>('emails.joinEmail'), 
        supportEmail: config.get<string>('emails.supportEmail')
    })
})

// The rest
router.get('/*', sendSiteFileFunc('index.html'))

export default router