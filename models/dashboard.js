import { Schema, model, ObjectId, Mixed } from 'mongoose'
import zlib from 'zlib'

const chartSchema = Schema({
  category: {
    type: String,
    required: [true, 'chartCategoryRequired'],
    enum: {
      values: [
        'barChart',
        'histogram',
        'lineChart',
        'areaChart',
        'scatterChart',
        'bubbleChart',
        'pieChart',
        'donutChart',
        'polarAreaChart',
        'radarChart',
        'mean',
        'median',
        'mode',
        'range',
        'IQR',
        'variance',
        'standardDeviation',
        'categoryFilter',
        'rangeFilter',
        'textbox',
        'rectangle',
        'circle',
        'triangle',
      ],
      message: 'chartCategoryInvalid',
    },
  },
  chartTitle: {
    type: String,
    default: function () {
      return `${this.category}`
    },
  },
  chartPosX: {
    type: Number,
    required: [true, 'chartPosXRequired'],
  },
  chartPosY: {
    type: Number,
    required: [true, 'chartPosYRequired'],
  },
  chartWidth: {
    type: Number,
    required: [true, 'chartWidthRequired'],
  },
  chartHeight: {
    type: Number,
    required: [true, 'chartHeightRequired'],
  },
  chartOption: {
    type: Mixed,
  },
  useVariables: {
    type: [String],
    required: [true, 'useVariablesRequired'],
  },
})

const schema = Schema(
  {
    dashboardName: {
      type: String,
      default: 'Untitled',
      required: [true, 'dashboardNameRequired'],
    },
    dashboardInfo: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    public: {
      type: Boolean,
      default: false,
    },
    like: {
      type: Number,
      default: 0,
    },
    likeUsers: {
      type: [ObjectId],
    },
    view: {
      type: Number,
      default: 0,
    },
    dataSet: {
      type: ObjectId,
      ref: 'dataSet',
    },
    charts: {
      type: [chartSchema],
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

// 如果有取 data 解壓縮 data
schema.post('findOne', async function (result) {
  try {
    if (result.dataSet?.data) {
      const decompressedData = await new Promise((resolve, reject) => {
        zlib.gunzip(result.dataSet.data.buffer, (err, data) => {
          if (err) {
            reject(new Error('gzip fail'))
          } else {
            resolve(JSON.parse(data.toString()))
          }
        })
      })
      result.dataSet.data = decompressedData
    }
  } catch (err) {
    console.log(err)
  }
})

export default model('dashboard', schema)
