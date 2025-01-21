import DataSet from '../models/dataSet.js'
import { StatusCodes } from 'http-status-codes'
import zlib from 'zlib'

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

export const getDataById = async (req, res) => {
  try {
    const result = await DataSet.find({ user: req.user._id, _id: req.params.id }).orFail(
      new Error('NOT FOUND'),
    )

    const decompressedData = await new Promise((resolve, reject) => {
      zlib.gunzip(result[0].data.buffer, (err, data) => {
        if (err) {
          reject(new Error('gunzipFAIL'))
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        dataName: result[0].dataName,
        data: decompressedData,
      },
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.message === 'gunzipFAIL') {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'gunzipFAIL',
      })
    } else if (err.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'dataSetNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const editDataById = async (req, res) => {
  try {
    const [result] = await DataSet.find({ user: req.user._id, _id: req.params.id }).orFail(
      new Error('NOT FOUND'),
    )

    result.dataName = req.body.dataName
    result.data = req.body.data
    result.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'dataSetNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const deleteDataById = async (req, res) => {
  try {
    await DataSet.findOneAndDelete({
      user: req.user._id,
      _id: req.params.id,
    }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'dataSetNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const adminGetData = async (req, res) => {
  try {
    const result = await DataSet.find(null, { data: 0 })

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
