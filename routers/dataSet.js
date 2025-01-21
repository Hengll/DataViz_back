import { Router } from 'express'
import * as dataSet from '../controllers/dataSet.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth.jwt, dataSet.create)
router.get('/getDataName', auth.jwt, dataSet.getDataName)
router.get('/getData/:id', auth.jwt, dataSet.getDataById)
router.patch('/editData/:id', auth.jwt, dataSet.editDataById)
router.delete('/deleteData/:id', auth.jwt, dataSet.deleteDataById)

router.get('/admin', auth.jwt, auth.admin, dataSet.adminGetData)

export default router
