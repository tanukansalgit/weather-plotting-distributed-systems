import pika
import json

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host = 'localhost', heartbeat=0)
)

channel = connection.channel()

def send_back(message):

    # message = {"year" : "2022",
    #     "month" : "01",
    #     "day" : "29",
    #     "hour" : "10",
    #     "minute" : "10",
    #     "second" : "10",
    #     "station" : "KIND"
    # }
    channel.queue_declare(queue = 'plotting_resend')

    channel.basic_publish(exchange = '', routing_key = 'plotting_resend', body = json.dumps(message))

    # channel.close()