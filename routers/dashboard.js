import { Router } from 'express'
import * as dashboard from '../controllers/dashboard.js'
import * as auth from '../middlewares/auth.js'
import thumbnail from '../middlewares/thumbnail.js'

const router = Router()

router.post('/', auth.jwt, dashboard.create)
router.get('/public', dashboard.getPublic)
router.get('/public/:id', dashboard.getPublicById)
router.get('/public/user/:id', dashboard.getPublicByUserId)
router.get('/', auth.jwt, dashboard.getAll)
router.get('/:id', auth.jwt, dashboard.getById)
router.patch('/:id', auth.jwt, thumbnail, dashboard.editById)
router.delete('/:id', auth.jwt, dashboard.deleteById)
router.patch('/like/:id', auth.jwt, dashboard.likeById)
router.patch('/view/:id', dashboard.viewById)

export default router
