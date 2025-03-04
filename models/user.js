import { Schema, model, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const schema = new Schema(
  {
    account: {
      type: String,
      required: [true, 'userAccountRequired'],
      minlength: [4, 'userAccountTooShort'],
      maxlength: [20, 'userAccountTooLong'],
      unique: true,
      validate: {
        validator(value) {
          return validator.isAlphanumeric(value)
        },
        message: 'userAccountInvalid',
      },
    },
    password: {
      type: String,
      required: [true, 'userPasswordRequired'],
    },
    email: {
      type: String,
      required: [true, 'userEmailRequired'],
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value)
        },
        message: 'userEmailInvalid',
      },
    },
    userName: {
      type: String,
      unique: true,
      required: [true, 'userUserNameRequired'],
    },
    userInfo: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    tokens: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4) {
      const err = new Error.ValidationError()
      err.addError('password', new Error.ValidatorError({ message: 'userPasswordTooShort' }))
      next(err)
    } else if (user.password.length > 20) {
      const err = new Error.ValidationError()
      err.addError('password', new Error.ValidatorError({ message: 'userPasswordTooLong' }))
      next(err)
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default model('user', schema)
