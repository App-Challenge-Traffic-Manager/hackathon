from pystray import Icon as icon, Menu as menu, MenuItem as item
import threading
import sys
from PIL import Image, ImageDraw
import pyperclip
from identity_service import get_identity


class TrayApp:
    def __init__(self, process_function=None, exit_function=None):

        self.process_function = process_function
        self.exit_function = exit_function

        self.myIcon = icon(
            'Traffic Optimization',
            icon=self.create_image(64, 64, 'black', 'white')
        )

        self.myIcon.menu = menu(
            item("Copiar Token", self.copy_token),
            item("Sair", self.exit_action)
        )

    def create_image(self, width, height, color1, color2):
        # Generate an image and draw a pattern
        image = Image.new('RGB', (width, height), color1)
        dc = ImageDraw.Draw(image)
        dc.rectangle(
            (width // 2, 0, width, height // 2),
            fill=color2)
        dc.rectangle(
            (0, height // 2, width // 2, height),
            fill=color2)

        return image

    def background_process(self):
        if self.process_function:
            self.process_function()

    def exit_action(self, icon, item):
        print("Saindo")
        if self.exit_function:
            self.exit_function()
        print("Parando TrayApp")
        icon.stop()
        sys.exit(0)

    def copy_token(self, icon, item):
        token_string = get_identity()["token"]
        pyperclip.copy(token_string)

    def start(self):
        # Inicia o processo em segundo plano
        threading.Thread(target=self.background_process).start()
        # self.background_process()
        print("Iniciando TrayApp")
        self.myIcon.run()

    def stop(self):
        self.myIcon.stop()
