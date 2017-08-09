from datetime import datetime
import time

def get_date():
    date = datetime.now()
    datestring = date.strftime('%Y-%m-%d %H:%M')
    zoom = 0
    minute = int(date.strftime('%M'))
    if minute % 5 == 0:
      zoom += 1
    if minute % 15 == 0:
      zoom += 1
    if minute % 30 == 0:
      zoom += 1
    if minute == 0:
      zoom += 1
    return datestring, zoom

def save_data(connection, temp, humidity, sensor_number, datestring, zoom):
    query = 'INSERT INTO reading (datetime, zoom, sensor, temperature, humidity) VALUES (%s, %s, %s, %s, %s);'
    cursor = connection.cursor()
    cursor.execute(query, (datestring, zoom, sensor_number, temp, humidity))
    connection.commit()
    cursor.close()