import * as authenticationController from '@controllers/authentication'
import * as generationJobsController from '@controllers/generation-jobs'
import * as root from '@controllers/root'
import { Resources, Actions } from '@lib/authorization/rbac'
import * as authenticate from '@middlewares/authenticate'
import {authorizeOwn} from '@middlewares/authorize'
import express from 'express'


const router = express.Router()


router.route('/authenticate/sign-in')
    .post(authenticate.login, authenticationController.signIn)


router.route('/generation-jobs')
    .post(authenticate.authenticateOrDie,authorizeOwn(Resources.Job, Actions.Create),generationJobsController.create)
/*    .get(authenticate.authenticateOrDie,authorize(permissions.manageJobs),generationJobsController.list)
router.route('/generation-jobs/actions')
    .post(authenticate.authenticateOrDie,authorize(permissions.manageJobs),generationJobsController.actions)
router.route('/generation-jobs/:id')
    .get(authenticate.authenticateOrDie,authorize(permissions.createPDF),generationJobsController.show)
*/

router.route('/').get(root.health)
router.route('/health').get(root.health)
router.route('/ready').get(root.ready)
router.get('/*', root.notFound)

export default router
