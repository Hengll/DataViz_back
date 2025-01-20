import DataSet from '../models/dataSet.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    req.body.user = req.user._id

    await DataSet.create(req.body)
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

export const getDataName = async (req, res) => {
  try {
    const result = await DataSet.find({ user: req.user._id }, 'dataName')

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

export const getDataNameById = async (req, res) => {
  try {
    const result = await DataSet.find({ user: req.user._id, _id: req.params.id }).orFail(
      'NOT_FOUND',
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
  }
}
