import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'
import passportJWT from 'passport-jwt'

passport.use(
  'login',
  new passportLocal.Strategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    async (account, password, done) => {
      try {
        const user = await User.findOne({ account: account }).orFail(new Error('ACCOUNT'))

        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('PASSWORD')
        }

        return done(null, user, null)
      } catch (err) {
        console.log('err : passport.js', err)

        if (err.message === 'ACCOUNT') {
          return done(null, null, { message: 'userNotFound' })
        } else if (err.message === 'PASSWORD') {
          return done(null, null, { message: 'userPasswordIncorrect' })
        } else {
          return done(null, null, { message: 'serverError' })
        }
      }
    },
  ),
)

passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
    },
    async (req, payload, done) => {
      try {
        const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

        const expired = payload.exp * 1000 < new Date().getTime()

        const url = req.baseUrl + req.path
        if (expired && url !== '/user/refresh' && url !== '/user/logout') {
          throw new Error('EXPIRED')
        }

        const user = await User.findById(payload._id).orFail(new Error('USER'))
        if (!user.tokens.includes(token)) {
          throw new Error('TOKEN')
        }
        return done(null, { user, token }, null)
      } catch (err) {
        console.log('err : passport.js', err)
        if (err.message === 'USER') {
          return done(null, null, { message: 'userNotFound' })
        } else if (err.message === 'TOKEN') {
          return done(null, null, { message: 'userTokenInvalid' })
        } else if (err.message === 'EXPIRED') {
          return done(null, null, { message: 'userTokenExpired' })
        } else {
          return done(null, null, { message: 'serverError' })
        }
      }
    },
  ),
)
