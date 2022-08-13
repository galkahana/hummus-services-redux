import express from 'express'
import asyncHandler from 'express-async-handler'

import * as root from '@controllers/root'
import * as authenticationController from '@controllers/authentication'
import * as generationJobsController from '@controllers/generation-jobs'
import * as generatedFilesController from '@controllers/generated-files'
import * as tokensController from '@controllers/tokens'
import * as usersController from '@controllers/users'
import * as accountingController from '@controllers/accounting'
import { Resources, Actions } from '@lib/authorization/rbac'
import * as authenticate from '@middlewares/authenticate'
import { authorizeOwn } from '@middlewares/authorize'
import { checkCaptcha } from '@middlewares/google-captcha'


const router = express.Router()


router.route('/generation-jobs')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Create), asyncHandler(generationJobsController.create))
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Read), asyncHandler(generationJobsController.list))
router.route('/generation-jobs/delete-jobs')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Update), asyncHandler(generationJobsController.deleteJobs))
router.route('/generation-jobs/delete-files')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Update), asyncHandler(generationJobsController.deleteFiles))
router.route('/generation-jobs/:id')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Job, Actions.Read), asyncHandler(generationJobsController.show))

router.route('/generated-files')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), asyncHandler(generatedFilesController.list))
router.route('/generated-files/:id')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), asyncHandler(generatedFilesController.show))
    .delete(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Delete), asyncHandler(generatedFilesController.remove))
router.route('/generated-files/:id/download')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), asyncHandler(generatedFilesController.download))
router.route('/generated-files/:id/embed')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.File, Actions.Read), asyncHandler(generatedFilesController.embed))

router.route('/users/me')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Read), asyncHandler(usersController.show))
    .patch(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Update), usersController.patch) // handles async internally cause is array
router.route('/users/me/plan-usage')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Read), asyncHandler(usersController.getPlanUsage))
router.route('/users/me/change-username')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Update), asyncHandler(usersController.changeUsername))
router.route('/users/me/change-password')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.User, Actions.Update), asyncHandler(usersController.changePassword))

router.route('/tokens')
    .get(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Read), asyncHandler(tokensController.show))
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Create), asyncHandler(tokensController.create))
router.route('/tokens/refresh') // this is the one action here that's actually about the jwts. not sure it belongs here
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Update), asyncHandler(tokensController.refresh))
router.route('/tokens/revoke')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Update), asyncHandler(tokensController.revoke))
router.route('/tokens/patch')
    .post(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Update), asyncHandler(tokensController.patch))


router.route('/authenticate/sign-in')
    .post(checkCaptcha, authenticate.login, asyncHandler(authenticationController.signIn))
router.route('/authenticate/sign-out')
    .delete(authenticate.authenticateOrDie, authorizeOwn(Resources.Token, Actions.Delete), asyncHandler(authenticationController.signOut))
router.route('/authenticate/sign-up')
    .post(checkCaptcha, usersController.create, asyncHandler(authenticationController.signIn)) // userController.create handles asyncs internally cause is array

router.route('/public/:publicDownloadId/download')
    .get(asyncHandler(generatedFilesController.downloadPublic))
router.route('/public/:publicDownloadId/embed')
    .get(asyncHandler(generatedFilesController.embedPublic))

router.route('/public/accounting/ran')
    .get(asyncHandler(accountingController.getTotalJobsCount))

router.route('/').get(root.health)
router.route('/health').get(root.health)
router.route('/ready').get(root.ready)
router.get('/*', root.notFound)

export default router
