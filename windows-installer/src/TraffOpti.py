import asyncio
import socketio
from scapy.all import *
from scapy.layers.inet import IP

from collections import defaultdict
import psutil
import os
import socket
import json
from threading import Thread


from identity_service import get_identity

from tray_app import TrayApp

"""
    UTILS SECTION
"""

SERVER = 'https://nettraf.ddns.net/socket.io/?token='

INFO_DELAY = 5

SEND_DATA_EVENT = 'receive-data'

LOGGER = True

my_identity = None

loop = asyncio.new_event_loop()
sio = socketio.AsyncClient(
    logger=LOGGER, reconnection=True, reconnection_attempts=5)

app_threads = []

"""
    START OF TRAFFIC MONITORING SECTION
"""
all_macs = set()

for iface in psutil.net_if_addrs():
    try:
        mac = psutil.net_if_addrs()[iface][0].address.lower()
        if (os.name == "nt"):
            mac = mac.replace("-", ":")
    except:
        mac = psutil.net_if_addrs()[iface][0].address
    finally:
        all_macs.add(mac)

connection2pid = {}
pid2process_class = {}
is_program_running = True


class Process:
    def __init__(self, pid, name, create_time, last_time_updated, upload, download):
        self.pid = pid
        self.name = name
        self.create_time = create_time
        self.last_time_updated = last_time_updated
        self.upload = upload
        self.download = download
        self.upload_speed = 0
        self.download_speed = 0
        self.protocol_traffic = defaultdict(lambda: [0, 0])
        self.hosts_traffic = defaultdict(lambda: [0, 0])

    def update_last_time_updated(self, new_time):
        self.last_time_updated = new_time

    def update_download(self, new_download: float):
        self.download += new_download

    def update_upload(self, new_upload: float):
        self.upload += new_upload

    def update_download_speed(self, new_download: float):
        self.download_speed = new_download

    def update_upload_speed(self, new_upload: float):
        self.upload_speed = new_upload

    def update_protocol_traffic(self, new_protocol_traffic: dict):
        protocol = list(new_protocol_traffic.keys())[0]

        # Download
        self.protocol_traffic[protocol][0] += new_protocol_traffic[protocol][0]
        # Upload
        self.protocol_traffic[protocol][1] += new_protocol_traffic[protocol][1]

    def update_hosts_traffic(self, new_hosts_traffic: dict):
        host = list(new_hosts_traffic.keys())[0]

        self.hosts_traffic[host][0] += new_hosts_traffic[host][0]  # Download
        self.hosts_traffic[host][1] += new_hosts_traffic[host][1]  # Upload

    def to_JSON(self):
        json_data = f'''{{
        "pid": "{self.pid}",
        "name": "{self.name}",
        "create_time": "{self.create_time}",
        "last_time_update": "{self.last_time_updated}",
        "upload": "{get_size(self.upload)}",
        "download": "{get_size(self.download)}",
        "upload_speed": {self.upload_speed},
        "download_speed": {self.download_speed},
        '''
        json_data += ''' "protocol_traffic": [ '''
        for protocol, traffic in self.protocol_traffic.items():
            json_data += f'''{{
            "protocol": "{protocol}",
            "download": "{get_size(traffic[0])}",
            "upload": "{get_size(traffic[1])}"
            '''
            if (protocol != list(self.protocol_traffic.keys())[-1]):
                json_data += ''' },'''
            else:
                json_data += ''' }'''

        json_data += ''' ], '''

        json_data += ''' "host_traffic": [ '''
        for host, traffic in self.hosts_traffic.items():
            json_data += f'''{{
            "host": "{host}",
            "download": "{get_size(traffic[0])}",
            "upload": "{get_size(traffic[1])}"
            '''
            if (host != list(self.hosts_traffic.keys())[-1]):
                json_data += ''' },'''
            else:
                json_data += ''' }'''

        json_data += ''']
        }'''

        json_object = json.loads(json_data)
        json_formatted_str = json.dumps(json_object, indent=4)

        return json_formatted_str
        # return json.dumps(self, default= lambda o: o.__dict__, sort_keys=True, indent=4)


def get_size(bytes: int):
    """
    Returns the formatted size of bytes, up to Petabytes
    """

    for unit in ['', 'K', 'M', 'G', 'T', 'P']:
        if bytes < 1024:
            return f"{bytes:.2f}{unit}B"
        bytes /= 1024


def get_connection():
    """A function that keeps listening for connections on this machine 
    and adds them to `connection2pid` dict"""

    global connection2pid
    # While is_program_running:
    # Using psutil, we can grab each connection's source and destination ports
    # And their process ID
    for c in psutil.net_connections():
        if c.laddr and c.raddr and c.pid:
            # If local address, remote address and PID are in the connection
            # Add them to our global dictionary
            connection2pid[(c.laddr.port, c.raddr.port)] = c.pid
            connection2pid[(c.raddr.port, c.laddr.port)] = c.pid


def get_traffic_data(packet: Packet):
    """
    Maps each connection to a process ID and store this information along with download/upload statics into the `pid2traffic` dict
    """
    global pid2traffic
    global pid2process_class

    upload = 0
    download = 0
    protocol = defaultdict(lambda: [0, 0])
    host = defaultdict(lambda: [0, 0])

    is_source = False
    protocol_port = 0
    host_ip = ""

    packet_size = len(packet)

    try:
        # Get the packet source & destination IP addresses and ports
        packet_connection = (packet.sport, packet.dport)
    except (AttributeError, IndexError):
        # Sometimes the packet does not have TCP/UDP layers, we just ignore these packets
        pass
    else:
        # Get the PID responsible for this connection from our `connection2pid` global dictionary
        packet_pid = connection2pid.get(packet_connection)
        if packet_pid:
            try:
                # Get process related to the PID
                p = psutil.Process(packet_pid)
            except (ProcessLookupError, psutil.NoSuchProcess):
                # If the process was closed, we ignore this packet
                pass
            else:
                if packet.src in all_macs:
                    # The source MAC address of the packet is our MAC address
                    # So it's an outgoing packet, meaning it's upload
                    is_source = True
                    upload = packet_size
                    protocol_port = packet_connection[1]
                    host_ip = packet[IP].dst
                else:
                    # Incoming packet, download
                    download = packet_size
                    protocol_port = packet_connection[0]
                    host_ip = packet[IP].src

                protocol_name = IP().get_field("proto").i2s[packet[IP].proto]

                try:
                    service_name = socket.getservbyport(
                        protocol_port, protocol_name)
                except OSError:
                    # "socket.getservbyport" has a limited amount of port-protocol combinations. If none match, we simply label the service as "others"
                    service_name = "others"

                if not is_source:
                    protocol[service_name][0] = packet_size
                    protocol[service_name][1] = 0
                    host[host_ip][0] = packet_size
                    host[host_ip][1] = 0
                else:
                    protocol[service_name][0] = 0
                    protocol[service_name][1] = packet_size
                    host[host_ip][0] = 0
                    host[host_ip][1] = packet_size

                new_time = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

                if not update_process(packet_pid, new_time, upload, download, protocol, host):
                    try:
                        create_time = datetime.fromtimestamp(p.create_time())
                    except OSError:
                        # System processes, using boot time instead
                        create_time = datetime.fromtimestamp(
                            psutil.boot_time())

                    create_time = create_time.strftime("%d/%m/%Y, %H:%M:%S")

                    try:
                        pid2process_class[packet_pid] = Process(
                            packet_pid, p.name(), create_time, new_time, upload, download)
                    except psutil.NoSuchProcess:
                        pass


def json_serialize_traffic_data():
    process_list_data = '''['''
    for process in list(pid2process_class):
        process_list_data += pid2process_class[process].to_JSON()

        if (process != list(pid2process_class.keys())[-1]):
            process_list_data += ''','''

    process_list_data += ''']'''

    json_object = json.loads(process_list_data)
    # json_formatted_str = json.dumps(json_object, indent=4)

    return json_object


def update_process(pid, new_time: str, upload: float, download: float, protocol: dict, host: dict) -> bool:

    global pid2process_class

    if pid in pid2process_class.keys():  # PID exists in the dictionary, therefore we update the process
        current_process = pid2process_class[pid]

        current_process.update_last_time_updated(new_time)
        current_process.update_upload(upload)
        current_process.update_download(download)
        current_process.update_upload_speed(upload)
        current_process.update_download_speed(download)
        current_process.update_protocol_traffic(protocol)
        current_process.update_hosts_traffic(host)

        pid2process_class[pid] = current_process

        # All updated, return true
        return True

    # PID doesn't exist, return false to create a new Process
    return False


def fetch_connections():
    while is_program_running:
        get_connection()


"""
    END OF TRAFFIC MONITORING SECTION
"""


"""
    START OF SOCKET.IO SECTION
"""


@sio.event
async def connect():
    print('connected to server')


async def send_data():
    global sio
    global is_program_running
    while is_program_running:
        try:
            print(f'program is running: {is_program_running}')
            json_data_string = json_serialize_traffic_data()
            time.sleep(INFO_DELAY)
            await sio.emit(SEND_DATA_EVENT, json_data_string)
        except Exception as e:
            print(e)
            print("Server is not available, trying to reconnect...")


def start_send_data():
    asyncio.run(send_data())


async def start_client_socket():
    try:
        await sio.connect(SERVER + my_identity['token'], transports=['websocket'])
        await sio.wait()
    except Exception as e:
        global LOGGER
        if LOGGER:
            print(e)
        print("Server is not available, trying to reconnect...")


def process_start_client_socket():
    asyncio.run(start_client_socket())


"""
    END OF SOCKET.IO SECTION
"""


def stop_process():
    global is_program_running

    global sio

    is_program_running = False

    sio.disconnect()

    print("Network sniffer stopped.")


def stop_capture(pkt):
    global is_program_running

    if is_program_running:
        return False

    global app_threads
    for a_thread in app_threads:
        a_thread.join()
    return True


def start_process():

    global my_identity

    my_identity = get_identity()

    socket_thread = Thread(target=process_start_client_socket, daemon=True)
    socket_thread.start()

    connection_thread = Thread(target=fetch_connections, daemon=True)
    connection_thread.start()

    send_data_thread = Thread(target=start_send_data, daemon=True)
    send_data_thread.start()

    global app_threads
    app_threads = [socket_thread, connection_thread, send_data_thread]
    print("Network sniffer initialized.")

    sniff(prn=get_traffic_data, store=False, stop_filter=stop_capture)

    global is_program_running

    is_program_running = False


def main():
    app = TrayApp(process_function=start_process, exit_function=stop_process)
    app.start()
    print('oi')
    sys.exit()


if __name__ == "__main__":
    main()
