import pika
import json
import os
from getPath import getEnvPath
from dotenv import load_dotenv
 
load_dotenv(getEnvPath())

# credentials = pika.PlainCredentials( os.getenv("RABBITMQ_USER") , os.getenv("RABBITMQ_PASSWORD") )

# parameters = pika.ConnectionParameters( os.getenv("RABBITMQ_HOST") ,
#                                    os.getenv("RABBITMQ_PORT") ,
#                                    '/',
#                                    credentials)

credentials = pika.PlainCredentials( "guest", "guest" )


parameters = pika.ConnectionParameters( "rabbitmq" ,
                                   "5672" ,
                                   '/',
                                   credentials, heartbeat=10000)

connection = pika.BlockingConnection(parameters)


channel = connection.channel()

def start_producer():
    print("Creating queue plotting_resend")
    channel.queue_declare(queue = 'plotting_resend')
    return
    
def send_response(message):
    channel.basic_publish(exchange = '', routing_key = 'plotting_resend', body = json.dumps(message))
