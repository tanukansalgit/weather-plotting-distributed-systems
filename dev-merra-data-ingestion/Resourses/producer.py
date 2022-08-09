import pika
import json
from dotenv import load_dotenv
import os
from getPath import getEnvPath

load_dotenv(getEnvPath())

# credentials = pika.PlainCredentials( os.getenv("RABBITMQ_USER") , os.getenv("RABBITMQ_PASSWORD") )
# parameters = pika.ConnectionParameters( os.getenv("RABBITMQ_HOST") ,
#                                    os.getenv("RABBITMQ_PORT") ,
#                                    '/',
#                                    credentials, heartbeat=10000)


credentials = pika.PlainCredentials( "guest", "guest" )

parameters = pika.ConnectionParameters( "rabbitmq" ,
                                   "5672" ,
                                   '/',
                                   credentials, heartbeat=10000 )

connection = pika.BlockingConnection(parameters)

channel = connection.channel()

def start_producer():
    print("Coming and creating plotting from function")
    channel.queue_declare(queue = 'plotting')
    return

def send_file(objectName):

    print("Sending message...")
    channel.basic_publish(exchange = '', routing_key = 'plotting', body = json.dumps(objectName))
        

