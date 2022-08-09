import os

def getEnvPath():
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    return dotenv_path