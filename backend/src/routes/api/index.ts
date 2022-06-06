import * as authenticationController from '@controllers/authentication'
import * as root from '@controllers/root'
import * as authenticate from '@middlewares/authenticate'
import express from 'express'


const router = express.Router()


router.route('/authenticate/sign-in')
    .post(authenticate.login, authenticationController.signIn)



router.route('/').get(root.health)
router.route('/health').get(root.health)
router.route('/ready').get(root.ready)
router.get('/*', root.notFound)

export default router
