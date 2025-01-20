import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import UserRole from '../enums/UserRole.js'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (!user || err) {
      if (info.message === 'Missing credentials') {
        info.message = 'requestFormatError'
      }

      if (info.message === 'serverError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: info.message,
        })
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: info.message,
        })
      }
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data, info) => {
    if (err || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'userTokenInvalid',
        })
      } else if (info.message === 'serverError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: info.message,
        })
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message,
        })
      }
    }

    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}

export const admin = (req, res, next) => {
  if (req.user.role !== UserRole.ADMIN) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'userPermissionDenied',
    })
  } else {
    next()
  }
}
