## History-Service
<!--Used for logging user activity, requests and the result of the requests. Integrated with API Gateway to store the result of the Plotting request. .-->

## Tech And Resources

This Microservice uses:
- [Go](https://go.dev/)
- [Gin Framework](https://github.com/gin-gonic/gin)
- [PostgreSQL](https://www.postgresql.org/)
- [Postgres Driver for GO](github.com/lib/pq)

## Installation

Create an `.env` with the help of `.env.example`. All the required variables is in it.  

This service is tested on GO 1.17

`.env.example` is given in the respository.

Install the libraries and dependencies and start the server.

```sh
cd respository_folder
go get ./...
go run .
```

The default Port is `8085` but you can change it `.env`.


### PostGreSQL Connection
>
    1. Install PostgreSQL.
    2. Create a database named `demo_db` through pgadmin or SQL Shell.
    
>   Mention the respective POSTGRES Details required in the `.env` given in `.env.example`.

>    The default and required parameters are:<br />
    `POSTGRES_HOST=localhost`<br />
    `POSTGRES_PORT=5432`<br />
    `POSTGRES_USER=postgres`<br />
    `POSTGRES_PASSWORD=admin`<br />
    `POSTGRES_DBNAME=demo_db`<br />

## API
**BASE URL**

  `history-service/api/v1`
##### Methods

`GET /ping`
`GET /:userId`
`POST /logs`

##### Responses
>`GET /:userId`
    
* **Success Response:**
      
  >
    Example of `GET` request `/61fce83ecbf3ad1165cb8da8`
  * **Code:** 202 
    **Content:** 
    ```JSON
    {
        "status": "OK",
        "isError": "False",
        "response": [
            {
                "userId": "\"61fce83ecbf3ad1165cb8da8\"",
                "logIdentifier": "\"678624\"",
                "logType": "RESPONSE",
                "logDetails": "{\"month\":\"2\",\"hour\":\"3\",\"year\":\"2022\",\"station\":\"KABX\",\"day\":\"1\",\"minute\":\"48\",\"second\":\"29\"}",
                "insertedOn": "2022-02-04T03:49:03.816888Z",
                "url": "\"http://res.cloudinary.com/dzlhjgubi/image/upload/v1643964542/KABX20220201_034732_V06.png\""
            },
            {
                "userId": "\"61fce83ecbf3ad1165cb8da8\"",
                "logIdentifier": "678624",
                "logType": "REQUEST",
                "logDetails": "{\"month\":\"2\",\"hour\":\"3\",\"year\":\"2022\",\"station\":\"KABX\",\"day\":\"1\",\"minute\":\"48\",\"second\":\"29\"}",
                "insertedOn": "2022-02-04T03:48:55.541841Z",
                "url": "NA"
            }
        ],
        "message": "LOGS OF THE SPECIFIED USER"
    }
    ```
* **Error Response:**
  If the `userId` does not exists
  >

  * **Code:** 200
    **Content:** 

    ```JSON
    {
        "status": "OK",
        "isError": "False",
        "response": null,
        "message": "LOGS OF THE SPECIFIED USER"
    }
    ```
* **Attributes:**
    >
    The `status` attribute indicates no error in code.
    
    The `response` containing a list of all the logs in posted to that `userId`. It is `null` when the userId is not existing in the database.

    The `insertedOn` indicates the timestamp when log was inserted in the database
    
    The `isError` indicates any error while fetching the data.

    `POST /logs`
* **Data Params for post body** 
    
    >    `userId=[string]` <br />
        `logType=[string]`<br />
        `logDetails=[string]`<br />
        `logIdentifier=[string][optional]` <br />
        `url=[string][optional]` <br />

    >
    Examples of POST request <br />
    When a `logIdentifier` is not provided it will generate one and return it.

    ```JSON
        {
            "userId":"1",
            "logType": "RESPONSE",
            "logDetails": "These are log details"
        }
    ```
    >
    When a `logIdentifier` is provided.

    ```JSON
        {
            "userId":"1",
            "logType": "RESPONSE",
            "logDetails": "These are log details",
            "url":"google.com",
            "logIdentifier": "532506"
        }
    ```
    

* **Success Response:**
  
  >

  * **Code:** 202 
    **Content:** 
    Respective to the upper mentioned Request Body.
    ```JSON
    {
        "status": "OK",
        "isError": "False",
        "response": {
            "logIdentifier": "522219"
        },
        "message": "Inserted Properly!"
    }
    ```

    ```JSON
    {
        "status": "OK",
        "isError": "False",
        "response": {
            "logIdentifier": "532506"
        },
        "message": "Inserted Properly!"
    }
    ```

* **Error Response:**

  These errors will be generated when the posted body doesn't qualify the required parameters.
  >

  * **Code:** 200
    **Content:** 
    When request body parameters are invalid
    ```JSON
    {
        "status": "NOT OK",
        "isError": "True",
        "response": {
            "logIdentifier": ""
        },
        "message": "Invalid Parameters Passed into JSON Object."
    }    
    ```


* **Attributes:**
    >
    The `logIdentifier` attribute indicates the special Id binded to the log.
    
    The `response` will have all the requried files and url for the images.
    
    The `url` will have the public link to the uploaded image which is sent to the gateway.
    
    This is generated when an internal error is generated due to unreadable file or not correct body. The `isError` will be true and the response will have a precomputed url 





## Links and References
1. Installing GIN for GO REST Service: https://gin-gonic.com/docs/quickstart/
2. Learn GO: https://fireship.io/lessons/learn-go-in-100-lines/
3. Documentation: https://go.dev/doc/tutorial/getting-started
4. https://go.dev/doc/tutorial/web-service-gin
5. https://go.dev/doc/code

