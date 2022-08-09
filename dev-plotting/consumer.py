import pika
import json
import asyncio
from Plotting import getPlottingDataController
from producer import send_back

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host = 'localhost')
)

channel = connection.channel()

def callback(ch, method, properties, body):

    print("Received: ", json.loads(body))
    data = json.loads(body)
    result = asyncio.run(getPlottingDataController(data))

    send_back(result)
    # result = await getPlottingDataController(json.loads(body))
    

channel.basic_consume(queue = 'plotting', on_message_callback = callback, auto_ack = True)

print('Waiting for messages')
channel.start_consuming()