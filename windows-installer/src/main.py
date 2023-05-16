
import socketio
from scapy.all import *
from threading import Thread

from identity_service import get_identity

from traffic_analyser import fetch_connections, get_traffic_data, json_serialize_traffic_data, is_program_running

SERVER = 'http://localhost:3333/api?token='

my_identity = None

sio = socketio.Client()


def send_data(data):
    sio.emit('send_message', data)


def send_data_to_server():
    print(f'Is program running: {is_program_running}')
    while is_program_running:
        data = json_serialize_traffic_data()
        if data:
            send_data(data)
            print("Data sent to server!")
        print("Sending data to server...")
        time.sleep(5)


@sio.event
def connect():
    print('connected to server')


def start_server():
    connection_string = SERVER + my_identity['token']
    sio.connect(url=connection_string, transports=['websocket'])
    sio.wait()


def main():
    """Main function"""
    print("Starting server...")
    global my_identity
    my_identity = get_identity()

    

    # send_data_to_server_thread = Thread(target=send_data_to_server)
    # send_data_to_server_thread.start()

    # fetch_connections_thread = Thread(target=fetch_connections)
    # fetch_connections_thread.start()
    
    start_server()


if __name__ == "__main__":
    main()
