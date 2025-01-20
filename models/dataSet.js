import { Schema, model, ObjectId } from 'mongoose'
import validator from 'validator'

const schema = new Schema(
  {
    dataName: {
      type: String,
      required: [true, 'dataNameRequired'],
    },
    data: {
      type: String,
      required: [true, 'dataRequired'],
      validate: {
        validator(value) {
          return validator.isJSON(value)
        },
        message: 'dataFormatError',
      },
    },
    user: {
      type: ObjectId,
      ref: 'user',
      required: [true, 'userIdRequired'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

schema.virtual('dataAttribute').get(function () {
  const dataSet = this
  return Object.keys(JSON.parse(dataSet.data))
})

export default model('dataSet', schema)
