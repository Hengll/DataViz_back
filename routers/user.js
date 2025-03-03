import { Router } from 'express'
import * as user from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/admin', auth.jwt, auth.admin, user.adminGetProfile)
router.delete('/admin/:id', auth.jwt, auth.admin, user.adminDeletUser)

router.post('/', user.create)
router.post('/login', auth.login, user.login)
router.get('/profile', auth.jwt, user.getProfile)
router.get('/profile/public/:id', user.getProfileByPublic)
router.patch('/profile', auth.jwt, upload, user.editProfile)
router.patch('/refresh', auth.jwt, user.refresh)
router.delete('/logout', auth.jwt, user.logout)

export default router
