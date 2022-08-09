from logging import raiseExceptions
from random import SystemRandom
from flask import Flask, jsonify, request
from pydantic import BaseModel
import asyncio
import json
from Plotting import getPlottingDataController
import json
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
import random
from dotenv import load_dotenv
from os import environ
load_dotenv()

app = Flask(__name__)

def randomImageIfException():
    listOfUrls= [
        "https://res.cloudinary.com/dzlhjgubi/image/upload/v1643658157/KTLX20190531_171624_V06.png",
        "https://res.cloudinary.com/dzlhjgubi/image/upload/v1643658135/KTLX20150531_171404_V06.gz.png",
        "https://res.cloudinary.com/dzlhjgubi/image/upload/v1643907846/KIND20150321_002706_V06.gz.png",
        "https://res.cloudinary.com/dzlhjgubi/image/upload/v1643917461/KABX20220201_140045_V06.png"
    ]
    random_index = random.randrange(len(listOfUrls))

    return listOfUrls[random_index]




schema = {
    "year" : 'str',
    "month" : 'str',
    "day" : 'str',
    "station" : 'str',
    "hour" : 'str',
    "minute" : 'str',
    "second" : 'str'
}
class getPlottedDataBodyInputs(Inputs):
    json = [JsonSchema(schema=schema)]

@app.route('/getFunctionCall', methods=['POST'])
def getFunctionCall():
    data = request.get_json()
    return data


@app.route("/ping")
async def root():
    return jsonify({ "ping" : "PONG,BING BONG"})

@app.route('/getPlottedData', methods=['POST'])
async def getPlottedData():
    # print("WE are here",requestBody)
    try:
        done,pending = await asyncio.wait([getPlottingDataController( dict(request.get_json())  )])
        # return result
        print("done Object is: ", done)
        for t in done:
            if t.result() == None:
                raise Exception
        for t in done:
                    return ({
                        "status" : True,
                        "isError" : False,
                        "response" : {
                            "result" : t.result() 
                        }
                    })
                
    except Exception as e:
        try:
            print("Exception raised: ", e)
            return({
                "status" : True,
                "isError" : True,
                "statusCode" : "INTERNAL_SERVER_ERROR OR REQUESTED DATA MISMATCH",
                "response" : {
                    "result" : {
                        "url":randomImageIfException()
                        }
                }
            })
        except Exception as e:
            return({
                "status" : True,
                "isError" : True,
                "statusCode" : "INTERNAL_SERVER_ERROR OR REQUESTED DATA MISMATCH",
                "response" : {
                    "result" : {
                        "url":randomImageIfException()
                        }
                }
            })

if __name__ == "__main__":
    
    HOST = environ.get('ROUTES_HOST')
    PORT = environ.get('ROUTES_PORT')
    
    app.run(host=HOST or 'localhost', port=PORT or 5010)
