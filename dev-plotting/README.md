## Plotting Service
When pinged the API with the required parameters, will return the link to a visualized plot of that NEXRAD AWS NOAA Level 2 data.
Test!

## Tech And Resources

This Microservice uses:
- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [Nexrad](https://unidata.github.io/python-gallery/examples/Nexrad_S3_Demo.html#plot-the-dat)
- [Nexradraws](https://nexradaws.readthedocs.io/en/latest/Tutorial.html#Tutorial)

## Installation

Create an `.env` with the help of `example.env`. All the required variables is in it.  

This service is tested on Python 3.7, 3.8, and 3.10 and will require any of these versions.

`.env.example` is given in the respository.

Install the libraries and dependencies and start the server.

```sh
cd respository_folder
pip install -r requirements.txt
python routes.py
```

The default Port is `8005` you can change it `.env`.

## API

##### Requests

`GET /ping`

`POST /getPlottedData`

##### Responses

* **Data Params for post body** 
    
    >    `year=[string]` <br />
        `month=[string]`<br />
        `day=[string]`<br />
        `hour=[string]`<br />
        `minute=[string]`<br />
        `second=[string]`<br />
        `station=[string]`<br />

    >
    Example of POST request <br />
  ```JSON
  {
    "year": "2015", 
    "month": "04",
    "day": "4",
    "hour": "3",
    "minute":"3",
    "second": "5",
    "station": "KAKQ"
    }
    ```
    

* **Success Response:**
  
  >

  * **Code:** 200 
    **Content:** 
    ```JSON
    {
        "isError": false,
        "response": {
            "result": {
                "api_key": "198111863142296",
                "asset_id": "7fc25f7ead6d47b7bef3dcc69249e4f4",
                "bytes": 144520,
                "created_at": "2022-02-04T23:34:34Z",
                "etag": "ac978566a8f1b5b340f08ca7e637b548",
                "format": "png",
                "height": 1474,
                "original_filename": "local_KAKQ20210404_030013_V06",
                "overwritten": true,
                "placeholder": false,
                "public_id": "KAKQ20210404_030013_V06",
                "resource_type": "image",
                "secure_url": "https://res.cloudinary.com/dzlhjgubi/image/upload/v1644017674/KAKQ20210404_030013_V06.png",
                "signature": "b5256828f523de897d3ee9b853aed9734cd8e577",
                "tags": [],
                "type": "upload",
                "url": "http://res.cloudinary.com/dzlhjgubi/image/upload/v1644017674/KAKQ20210404_030013_V06.png",
                "version": 1644017674,
                "version_id": "e8050b85db1b5452576454bc1e9d324d",
                "width": 1490
            }
        },
        "status": true
    }
    ```

* **Error Response:**

  These errors will be generated when the posted body doesn't qualify the required parameters. It will set `isError` as true and return a random url of precomputed data.
  >

  * **Code:** 200
    **Content:** 
    ```JSON
    {
        "isError": true,
        "response": {
            "result": {
                "url": "https://res.cloudinary.com/dzlhjgubi/image/upload/v1643658157/KTLX20190531_171624_V06.png"
            }
        },
            "status": true,
            "statusCode": "INTERNAL_SERVER_ERROR OR REQUESTED DATA MISMATCH"
    }
    ```

* **Attributes:**
    >
    The `isError` attribute indicates any internal error or indicated body received not as wanted with values `false` or `true`. 
    
    The `response` will have all the requried files and url for the images.
    
    The `url` will have the public link to the uploaded image which is sent to the gateway.
    
    This is generated when an internal error is generated due to unreadable file or not correct body. The `isError` will be true and the response will have a precomputed url 


## LINKS AND REFERENCES
1. https://nexradaws.readthedocs.io/en/latest/Tutorial.html#Working-with-LocalNexradFile-objects
2. https://unidata.github.io/python-gallery/examples/Nexrad_S3_Demo.html#plot-the-dat
3. https://www.stanleyulili.com/powershell/solution-to-running-scripts-is-disabled-on-this-system-error-on-powershell/

## Reasoning

* To access and download the AWS S3 data based on the required parameter we used  [Nexradraws](https://nexradaws.readthedocs.io/en/latest/Tutorial.html#Tutorial) library.
* [Unidata Python Galary](https://unidata.github.io/python-gallery/examples/Nexrad_S3_Demo.html#subset-data) This was used because of the specific reason as to how should we go about actually getting the data we want from the file, different types of elevation and products. The given demo code was perfect for our task and we were able to plot the data.
* [FLASK](https://flask.palletsprojects.com/en/2.0.x/) This was actually our second choice. The [FAST API](https://fastapi.tiangolo.com/) was first choice because of ease of implementation but we discovered a error in requests library used by uvicorn distribution for running the Fast API module. We tried searching and found it is an error in requests library, looking for how would we solve it was taking immense time that we did not have. So we decided to switch to Flask.

We decided to store the visualized images online to cloud service instead of storing it in our SQL database because of the fact that images take a lot of space which would add to the read performance and cost. Making it hard to backup the database if required. So know we would be storing the images elsewhere and store the reference to it in the database. We thought of using AWS S3 Bucket to dump the images because of the file structure it provides and highly scalable functionality. The problem was cost because at this scale there was no need of paid services, so we decided to go with other free online storage options. 

* [Cloudinary](https://cloudinary.com/) This provides a fantastic python supported API for uploading images.

If there was enough time I would hash the input data and the respective url for the plot generated in a persistent database, similar to the concept of  Hash Map, where the key would be the input data and value would be the url. If the exact same input was previously encountered it would pick the respected value, which would greatly reduce the extra computational task and load.




