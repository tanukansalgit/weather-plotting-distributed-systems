import cloudinary
from cloudinary import uploader
from decouple import config

cloudinary.config( 
  cloud_name = config('CLOUDINARY_CLOUD_NAME'), 
  api_key = config('CLOUDINARY_API_KEY'), 
  api_secret = config('CLOUDINARY_API_SECRET') 
)

async def uploadImage(imageFileName, dataFileName):
    result = uploader.upload(imageFileName, public_id = dataFileName )
    return result