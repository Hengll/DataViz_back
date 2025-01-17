import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

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
