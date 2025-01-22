import { Router } from 'express'
import * as dataSet from '../controllers/dataSet.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth.jwt, dataSet.create)
router.get('/names', auth.jwt, dataSet.getDataName)
router.get('/:id', auth.jwt, dataSet.getDataById)
router.patch('/:id', auth.jwt, dataSet.editDataById)
router.delete('/:id', auth.jwt, dataSet.deleteDataById)

router.get('/admin', auth.jwt, auth.admin, dataSet.adminGetData)

export default router
