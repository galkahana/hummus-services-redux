import express, { Request, Response, Express } from 'express'
import path from 'path'
import config from 'config'
import fs from 'fs'
import * as root from '@controllers/root'

const router = express.Router()

export const WEB_PATH = path.join(__dirname, '../../frontend-build')

const IS_SERVING_FRONTEND = fs.existsSync(WEB_PATH)


function sendSiteFileFunc(pathToPage: string) {
    return function(_req: Request, res: Response) {
        res.sendFile(pathToPage, {
            root: WEB_PATH
        })
    }
}

export function setup(app: Express) {
    if(IS_SERVING_FRONTEND)
        app.use(express.static(WEB_PATH))
}
 
// The client runtime config file. This method is to be used when frontend is served via the backend,
// specifically when the frontend is built at docker build time. By providing configuration via a dynamic config.js
// file, docker run env vars (or later any k8s delpolyment env vars) may be used to determine client behavior.
// If using a separate serving method this means that the client is built separately, and the relevant env vars may be
// provided there at client build time, instead.
if(IS_SERVING_FRONTEND) {
    router.get('/config.js', (_: Request, response: Response) => {
        response.render('config.js.mustache', {
            captchaSiteKey: config.get('recaptcha.disabled') ? '':  config.get<boolean>('recaptcha.key'), 
            joinEmail: config.get<string>('emails.joinEmail'), 
            supportEmail: config.get<string>('emails.supportEmail')
        })
    })
}

// The rest
router.get('/*', IS_SERVING_FRONTEND ? sendSiteFileFunc('index.html'): root.notFound)

export default router