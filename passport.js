import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'

passport.use(
  'login',
  new passportLocal.Strategy({
    usernameField: 'account',
    passwordField: 'password',
  }),
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
)
