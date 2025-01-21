import Dashboard from '../models/dashboard.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    req.body.user = req.user._id

    await Dashboard.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)

    if (err.name === 'ValidationError') {
      // 驗證錯誤
      const key = Object.keys(err.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    const result = await Dashboard.find(
      { public: true },
      { dashboardInfo: 0, charts: 0, public: 0 },
    ).populate({ path: 'user', select: 'userName' })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const getById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Dashboard.findOne(
      { public: true, _id: req.params.id },
      { image: 0, public: 0 },
    )
      .populate({
        path: 'user',
        select: 'userName',
      })
      .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'dashboardIdInvalid',
      })
    } else if (err.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'dashboardNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const getAllByUserId = async (req, res) => {}
