import { Router } from 'express'
import * as dashboard from '../controllers/dashboard.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth.jwt, dashboard.create)
router.get('/public', dashboard.getPublic)
router.get('/public/:id', dashboard.getPublicById)
router.get('/public/user/:id', dashboard.getPublicByUserId)
router.get('/', auth.jwt, dashboard.getAll)
router.get('/:id', auth.jwt, dashboard.getById)
router.patch('/:id', auth.jwt, dashboard.editById)
router.delete('/:id', auth.jwt, dashboard.deleteById)

// router.get('/admin', auth.jwt, auth.admin, table.adminGetData)

export default router
