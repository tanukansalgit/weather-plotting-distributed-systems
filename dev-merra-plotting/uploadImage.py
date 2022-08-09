import cloudinary
from cloudinary import uploader
from decouple import config

cloudinary.config( 
  cloud_name = config('CLOUDINARY_CLOUD_NAME'), 
  api_key = config('CLOUDINARY_API_KEY'), 
  api_secret = config('CLOUDINARY_API_SECRET') 
)


def upload_file(file, userId):

    result = uploader.upload(file, use_filename=True, folder="Images/"+userId, public_id = file[:-8])
    return result