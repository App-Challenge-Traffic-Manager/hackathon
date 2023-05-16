import hashlib
import json
from datetime import datetime
from pathlib import Path

identity_file = Path("identity.json")


def generate_token():
    today = datetime.now()
    today = today.strftime("%d/%m/%Y %H:%M:%S")
    m = hashlib.md5()
    m.update(today.encode('utf-8'))
    m.update(b'0x0')
    deviceId = m.hexdigest()

    return deviceId


def check_if_identity_exists():
    identity_file = Path("identity.json")
    if identity_file.is_file():
        return True
    else:
        return False


def create_identity_if_not_exists():
    if check_if_identity_exists() == False:
        identity = {}
        identity["token"] = generate_token()
        identity["created_at"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        with open('identity.json', 'w') as f:
            json.dump(identity, f, indent=4)


def get_identity():
    create_identity_if_not_exists()
    if check_if_identity_exists() == True:
        with open('identity.json', 'r') as f:
            identity = json.load(f)
        return identity
    else:
        return None
