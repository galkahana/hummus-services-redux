import express, { Request, Response, Express } from 'express'
import path from 'path'

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
 
router.get('/*', sendSiteFileFunc('index.html'))

export default router