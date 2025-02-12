import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async (req, res, next) => {
  try {
    console.log(typeof req.body.image)
    // const result = await cloudinary.uploader.upload(req.body.image, {
    //   asset_folder: 'DataViz',
    //   resource_type: 'image',
    //   public_id: 'test123456789',
    //   overwrite: true,
    //   transformation: [{ width: 640, height: 360, crop: 'limit' }],
    // })
    // console.log(result)
    next()
  } catch (err) {
    console.log('err : upload.js', err)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'uploadFailed',
    })
  }
}
