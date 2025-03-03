import Dashboard from '../models/dashboard.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    req.body.user = req.user._id

    const result = await Dashboard.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        _id: result._id,
      },
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)

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
    let result
    if (req.query.search) {
      const resultBySearch = await Dashboard.find(
        { public: true },
        { dashboardInfo: 0, charts: 0, public: 0, dataSet: 0, likeUsers: 0 },
      )
        .populate({ path: 'user', select: 'userName' })
        .sort({ [req.query.sort]: -1 })

      result = resultBySearch
        .filter((val) => {
          if (
            val.dashboardName.toLowerCase().includes(req.query.search.toLowerCase()) ||
            val.user.userName.toLowerCase().includes(req.query.search.toLowerCase())
          ) {
            return true
          } else {
            return false
          }
        })
        .slice(
          (req.query.page - 1) * req.query.limit,
          (req.query.page - 1) * req.query.limit + req.query.limit,
        )
    } else {
      result = await Dashboard.find(
        { public: true },
        { dashboardInfo: 0, charts: 0, public: 0, dataSet: 0, likeUsers: 0 },
      )
        .populate({ path: 'user', select: 'userName' })
        .sort({ [req.query.sort]: -1 })
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit)
    }

    // public資料筆數
    const numsOfData = await Dashboard.countDocuments({ public: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
      numsOfData,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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
    console.log('err : controllers/dashboard.js\n', err)
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
      { dashboardInfo: 0, charts: 0, public: 0, dataSet: 0, likeUsers: 0 },
    )
      .populate({ path: 'user', select: 'userName userInfo avatar' })
      .sort({ createdAt: -1 })
    // .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
    if (err.name === 'CastError' || err.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'dashboardIdInvalid',
      })
    }
    // else if (err.message === 'NOT FOUND') {
    //   res.status(StatusCodes.NOT_FOUND).json({
    //     success: false,
    //     message: 'dashboardNotFound',
    //   })
    // }
    else {
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
      { dashboardInfo: 0, charts: 0, dataSet: 0, likeUsers: 0, public: 0 },
    )
      .populate({ path: 'user', select: 'userName' })
      .sort({ updatedAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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
      { user: req.user._id, _id: req.params.id },
      {
        image: 0,
        user: 0,
        likeUsers: 0,
      },
    )
      .populate({ path: 'dataSet', select: 'dataName data dataInfo' })
      .orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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

    req.body.image = req.file?.path
    req.body.charts = req.body.charts ? JSON.parse(req.body.charts) : undefined

    await Dashboard.findOneAndUpdate({ user: req.user._id, _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
    }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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
    await Dashboard.findByIdAndDelete({ user: req.user._id, _id: req.params.id }).orFail(
      new Error('NOT FOUND'),
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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

export const likeById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Dashboard.findById(req.params.id, 'like likeUsers').orFail(
      new Error('NOT FOUND'),
    )

    if (result.likeUsers.includes(req.user._id)) {
      const idx = result.likeUsers.findIndex((user) => user === req.user._id)
      result.likeUsers.splice(idx, 1)
      result.like--
      await result.save()
    } else {
      result.likeUsers.push(req.user._id)
      result.like++
      await result.save()
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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

export const viewById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Dashboard.findById(req.params.id, 'view').orFail(new Error('NOT FOUND'))

    result.view++
    await result.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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

export const adminGetAll = async (req, res) => {
  try {
    const result = await Dashboard.find()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const adminDeletDashboard = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    await Dashboard.findByIdAndDelete(req.params.id).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (err) {
    console.log('err : controllers/dashboard.js\n', err)
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
