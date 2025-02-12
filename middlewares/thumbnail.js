import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer()
// const upload = multer({
//   storage: new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => {
//       console.log(file)
//       return {
//         asset_folder: 'DataViz',
//         resource_type: 'image',
//         public_id: 'test123456789',
//         overwrite: true,
//         transformation: [{ width: 640, height: 360, crop: 'limit' }],
//       }
//     },
//   }),
//   fileFilter(req, file, callback) {
//     if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
//       callback(null, true)
//     } else {
//       callback(null, false)
//     }
//   },
//   limits: {
//     // 限制檔案尺寸 1MB
//     fileSize: 1024 * 1024,
//   },
// })

export default (req, res, next) => {
  upload.array('image')(req, res, (err) => {
    if (err) {
      console.log('err : upload.js', err)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'uploadFailed',
      })
    } else {
      console.log(req.files[0])

      cloudinary.uploader.upload('123', {
        asset_folder: 'DataViz',
        resource_type: 'image',
        public_id: 'test123456789',
        overwrite: true,
        transformation: [{ width: 640, height: 360, crop: 'limit' }],
      })
      next()
    }
  })
}
// 改用base64
