
import asyncio
import socketio

from identity_service import get_identity

SERVER = 'http://localhost:3333/api?token='

my_identity = None

loop = asyncio.get_event_loop()
sio = socketio.AsyncClient()
start_timer = None


@sio.event
async def connect():
    print('connected to server')


async def start_server():
    connection_string = SERVER + my_identity["token"]
    await sio.connect(connection_string, transports=['websocket'],)
    await sio.wait()


def main():
    """Main function"""
    print("Starting server...")
    global my_identity
    my_identity = get_identity()

    loop.run_until_complete(start_server())


if __name__ == "__main__":
    main()
