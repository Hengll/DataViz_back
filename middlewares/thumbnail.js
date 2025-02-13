import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req) => {
      return {
        asset_folder: 'DataViz/Thumbnail',
        resource_type: 'image',
        public_id: req.params.id,
        overwrite: true,
        transformation: [{ width: 640, height: 360, crop: 'limit' }],
      }
    },
  }),
  fileFilter(req, file, callback) {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  limits: {
    // 限制檔案尺寸 1MB
    fileSize: 1024 * 1024,
  },
})

export default (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.log('err : upload.js', err)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'uploadFailed',
      })
    } else {
      next()
    }
  })
}
