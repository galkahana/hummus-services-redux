import express, { Request, Response } from 'express'

const router = express.Router()



// health check(s)
function health(_req: Request, res: Response) {
    res.status(200).send('hello world. I am Hummus Services and I approve this message.')
}
router.route('/').get((req, res) => {
    health(req, res)
})
router.route('/health').get((req, res) => {
    health(req, res)
})

// fallback
router.get('/*', function(req, res) {
    res.notFound('API call not found')
})

export default router
