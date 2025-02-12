import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dfpsdgyym',
  api_key: '573925387791835',
  api_secret: 'elFeaEQaQ1fPa2CbNHjGmtDQq0w',
})

const image = './logo1.png'

const run = async () => {
  const result = await cloudinary.uploader.upload(image, {
    asset_folder: 'DataViz',
    resource_type: 'image',
    public_id: 'test123456789',
    overwrite: true,
    transformation: [{ width: 640, height: 360, crop: 'limit' }],
  })
  console.log(result)
}

run()
