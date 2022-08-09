import os

def getEnvPath():
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')  # Path to .env file
    return dotenv_path