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

export const getPublic = async (req, res) => {
  try {
    const result = await Dashboard.find(
      { public: true },
      { dashboardInfo: 0, charts: 0, public: 0, dataSet: 0 },
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

export const getPublicById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Dashboard.findOne(
      { public: true, _id: req.params.id },
      { image: 0, public: 0 },
    )
      .populate([
        { path: 'dataSet', select: 'data' },
        {
          path: 'user',
          select: 'userName',
        },
      ])
      .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
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

export const getPublicByUserId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Dashboard.find(
      { public: true, user: req.params.id },
      { dashboardInfo: 0, charts: 0, public: 0, dataSet: 0 },
    )
      .populate({ path: 'user', select: 'userName userInfo avatar' })
      .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
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

export const getAll = async (req, res) => {
  try {
    const result = await Dashboard.find(
      { user: req.user._id },
      { dashboardInfo: 0, charts: 0, dataSet: 0, user: 0 },
    )

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
      { _id: req.params.id },
      { image: 0, good: 0, view: 0, user: 0 },
    )
      .populate({ path: 'dataSet', select: 'dataName data dataInfo' })
      .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
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

export const editById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    await Dashboard.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'dashboardIdInvalid',
      })
    } else if (err.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'dashboardNotFound',
      })
    } else if (err.name === 'ValidationError') {
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

export const deleteById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    await Dashboard.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dataSet.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'dataSetIdInvalid',
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
