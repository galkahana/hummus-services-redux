import express from 'express'

import * as root from '@controllers/root'
import * as authenticationController from '@controllers/authentication'
import * as generationJobsController from '@controllers/generation-jobs'
import * as generatedFilesController from '@controllers/generated-files'
import * as tokensController from '@controllers/tokens'
import * as usersController from '@controllers/users'
import { Resources, Actions } from '@lib/authorization/rbac'
import * as authenticate from '@middlewares/authenticate'
import { authorizeOwn } from '@middlewares/authorize'


const router = express.Router()


router.route('/generation-jobs')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Create), generationJobsController.create)
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Read), generationJobsController.list)
router.route('/generation-jobs/actions')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Update), generationJobsController.actions)
router.route('/generation-jobs/:id')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Read), generationJobsController.show)

router.route('/generated-files')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), generatedFilesController.list)
router.route('/generated-files/:id')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), generatedFilesController.show)
    .delete(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Delete), generatedFilesController.remove)
router.route('/generated-files/:id/download')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), generatedFilesController.download)
router.route('/generated-files/:id/embed')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), generatedFilesController.embed)

router.route('/users/me')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Read), usersController.show)
    .patch(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Update), usersController.patch)    
router.route('/users/me/plan-usage')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Read), usersController.getPlanUsage)
router.route('/users/me/actions')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Update), usersController.actions)

router.route('/tokens')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Read), tokensController.show)
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Create), tokensController.create)
router.route('/tokens/actions')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Update), tokensController.actions)

router.route('/authenticate/sign-in')
    .post(authenticate.login, authenticationController.signIn)
router.route('/authenticate/sign-out')
    .delete(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Delete), authenticationController.signOut)
//router.route('/authenticate/sign-up')
//    .post(capcha.checkcapcha, usersController.create, authenticationController.signIn)

router.route('/').get(root.health)
router.route('/health').get(root.health)
router.route('/ready').get(root.ready)
router.get('/*', root.notFound)

export default router
