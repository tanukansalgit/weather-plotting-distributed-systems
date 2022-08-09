import os

from flask import Flask
from flask_restful import Api
from Resourses.producer import start_producer
from Resourses.plotRequest import plotData
from dotenv import load_dotenv
from getPath import getEnvPath

load_dotenv(getEnvPath())
app = Flask(__name__)
api = Api(app)
start_producer()
api.add_resource(plotData, '/plottingmerra')

if __name__ == '__main__':
    app.run( host=os.getenv("FLASK_HOST"), port= os.getenv("FLASK_PORT") or "5051", debug=True )

