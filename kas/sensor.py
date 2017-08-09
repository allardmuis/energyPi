import Adafruit_DHT
import config
import mysql.connector
from datetime import datetime
import time
import sensor_data

def wait_for_next_minute():
    date = datetime.now()
    seconds = int(date.strftime('%S'))
    time.sleep(61 - seconds)

def read_save_all():
    datestring, zoom = sensor_data.get_date()
    connection = mysql.connector.connect(user=config.database['user'], password=config.database['password'],
                                         host='localhost', database=config.database['database'])
    
    for number, sensor in enumerate(config.sensors):
        temp, humidity = read_sensor(sensor['pin'])
        if temp != None and humidity != None:
            sensor_data.save_data(connection, temp, humidity, number, datestring, zoom)

    connection.close()


def read_sensor(pin):
    try:
        humidity, temp = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, pin)
        if temp != None:
            temp = int(temp*10)
        if humidity != None:
            humidity = int(humidity*10)
        return temp, humidity
    except:
        return None, None
  

while True:
    wait_for_next_minute()
    read_save_all()
