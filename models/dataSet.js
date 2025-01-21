import { Schema, model, ObjectId, Mixed } from 'mongoose'
import zlib from 'zlib'

const schema = new Schema(
  {
    dataName: {
      type: String,
      required: [true, 'dataNameRequired'],
    },
    dataInfo: {
      type: String,
      default: '',
    },
    data: {
      type: Mixed,
      required: [true, 'dataRequired'],
      validate: {
        validator(value) {
          return (
            Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null)
          )
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

schema.pre('save', function (next) {
  const dataSet = this

  zlib.gzip(JSON.stringify(dataSet.data), (err, compressedData) => {
    if (err) {
      console.log('gzip fail', err)
      next()
    } else {
      console.log('gzip success')
      dataSet.data = compressedData
      next()
    }
  })
})

export default model('dataSet', schema)
