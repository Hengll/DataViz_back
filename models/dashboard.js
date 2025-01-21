import { Schema, model, ObjectId, Mixed } from 'mongoose'

const chartSchema = Schema({
  category: {
    type: String,
    required: [true, 'chartCategoryRequired'],
    enum: {
      values: ['barChart', 'lineChart'],
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
  useAttribute: {
    type: [String],
    required: [true, 'useAttributeRequired'],
  },
})

const schema = Schema({
  dashboardName: {
    type: String,
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
    default: 0,
  },
  good: {
    type: Number,
    default: 0,
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
})

export default model('dashboard', schema)
