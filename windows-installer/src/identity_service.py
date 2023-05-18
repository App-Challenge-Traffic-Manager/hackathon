import hashlib
import json
from datetime import datetime
from pathlib import Path
import os
import sys

# Obtém o caminho do arquivo JSON na pasta anterior aos arquivos deste script
json_file_path = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'identity.json')


def generate_token():
    today = datetime.now()
    today = today.strftime("%d/%m/%Y %H:%M:%S")
    m = hashlib.md5()
    m.update(today.encode('utf-8'))
    m.update(b'0x0')
    deviceId = m.hexdigest()

    return deviceId


def check_if_identity_exists():
    identity_file = Path(json_file_path)
    print(identity_file)
    if identity_file.is_file():
        return True
    else:
        return False


def create_identity_if_not_exists():
    if check_if_identity_exists() == False:
        identity = {}
        identity["token"] = generate_token()
        identity["created_at"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        with open(json_file_path, 'w') as f:
            json.dump(identity, f, indent=4)


def get_identity():
    create_identity_if_not_exists()
    if check_if_identity_exists() == True:
        with open(json_file_path, 'r') as f:
            identity = json.load(f)
        return identity
    else:
        return None
