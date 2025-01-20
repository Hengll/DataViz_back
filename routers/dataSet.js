import { Router } from 'express'
import * as dataSet from '../controllers/dataSet.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', auth.jwt, dataSet.create)
router.get('/getDataName', auth.jwt, dataSet.getDataName)

export default router
