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
          return Array.isArray(value) && value.every((item) => typeof item === 'object')
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

// 壓縮 data (save)
schema.pre('save', function (next) {
  zlib.gzip(JSON.stringify(this.data), (err, compressedData) => {
    if (err) {
      console.log('gzip fail', err)
      next(err)
    } else {
      this.data = compressedData
      next()
    }
  })
})

// 解壓縮 data
schema.post('findOne', async function (result, next) {
  try {
    const decompressedData = await new Promise((resolve, reject) => {
      zlib.gunzip(result.data.buffer, (err, data) => {
        if (err) {
          reject(new Error('gunzip fail'))
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })
    result.data = decompressedData
  } catch (err) {
    console.log(err.message, err)
    next(err)
  }
})

export default model('dataSet', schema)
