import { Router } from 'express'
import * as dashboard from '../controllers/dashboard.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth.jwt, dashboard.create)
router.get('/getAll', dashboard.getAll)
router.get('/get/:id', dashboard.getById)
router.get('/getAll/:id', dashboard.getAllByUserId)
router.get('/getAllWithPrivate', auth.jwt, dashboard.getAllWithPrivate)
router.get('/getWithPrivate/:id', auth.jwt, dashboard.getWithPrivate)
// router.get('/getDataName', auth.jwt, table.getDataName)
// router.get('/getData/:id', auth.jwt, table.getDataById)
// router.patch('/editData/:id', auth.jwt, table.editDataById)
// router.delete('/deleteData/:id', auth.jwt, table.deleteDataById)

// router.get('/admin', auth.jwt, auth.admin, table.adminGetData)

export default router
