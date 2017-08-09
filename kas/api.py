from cgi import parse_qs
import mysql.connector
import json
import config
import sensor_data

def application(env, start_response):
    
    request_method = env['REQUEST_METHOD']
    if (request_method == 'GET'):
        return handle_get(env, start_response)
    
    if (request_method == 'POST'):
        return handle_post(env, start_response)
    
    start_response('400 Bad Request', [])
    return ['Request method ' + request_method + ' not supported']
    

def handle_get(env, start_response):
    query = parse_qs(env['QUERY_STRING'])
    start = query.get('start', [False])[0]
    end = query.get('end', [False])[0]
    zoom = query.get('zoom', [0])[0]
    sensors = query.get('sensors', [''])[0].split(',')
    
    if not start or not end:
        start_response('400 Bad Request', [])
        return []

    response = get_response(start, end, zoom, sensors)

    start_response('200 OK', [('Content-Type', 'application/json')])
    return [json.dumps(response)]

def get_response(start, end, zoom, sensors):
    connection = get_connection()
    cursor = connection.cursor()

    query = "SELECT sensor, datetime, temperature, humidity  FROM reading WHERE datetime >= %s AND datetime <= %s AND zoom >= %s";
    data = (start, end, zoom)
    if sensors:
        in_placeholders = ','.join(['%s'] * len(sensors))
        query += " AND sensor IN (%s)" % in_placeholders
        data += tuple(sensors)
    
    query += " ORDER BY sensor ASC, datetime ASC"
    cursor.execute(query, data)
    
    response = parse_result(cursor)
    cursor.close()
    connection.close()
    return response


def parse_result(cursor):
    
    result = []
    last_sensor = -1
    sensor_result = []
    for (sensor, datetime, temperature, humidity) in cursor:
        if sensor != last_sensor:
            if last_sensor >= 0:
                result.append({
                    'sensor': last_sensor,
                    'data': sensor_result,
                })
            last_sensor = sensor
            sensor_result = []
        
        sensor_result.append({
            'datetime': datetime.strftime('%Y-%m-%d %H:%M'),
            'temperature': temperature / 10.0,
            'humidity': humidity / 10.0,
        })
    
    if len(sensor_result) > 0:
        result.append({
            'sensor': last_sensor,
            'data': sensor_result,
        })

    return result

def handle_post(env, start_response):
    try:
        content_length = int(env.get('CONTENT_LENGTH', 0))
    except (ValueError):
        content_length = 0
    
    request_body = env['wsgi.input'].read(content_length)
    data = parse_qs(request_body)
    temperature = data.get('temperature', [False])[0]
    humidity = data.get('humidity', [False])[0]
    sensor = data.get('sensor', [False])[0]
    secret = data.get('secret', [False])[0]
    if not temperature or not humidity or not sensor:
        start_response('400 Bad Request', [])
        return []
    
    if secret != config.secret:
        start_response('401 Forbidden', [])
        return [request_body]
    
    datestring, zoom = sensor_data.get_date();
    connection = get_connection()
    sensor_data.save_data(connection, temperature, humidity, sensor, datestring, zoom)
    connection.close()
    
    start_response('200 OK', [('Content-Type', 'application/text')])
    
    return []


def get_connection():
    return mysql.connector.connect(user=config.database['user'], password=config.database['password'],
                             host='127.0.0.1', database=config.database['database'])

