import { Component, OnInit } from '@angular/core';
import { IDevice } from 'src/app/interfaces/device.interface';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  devices: IDevice[] = [];

  constructor(private readonly deviceService: DeviceService) {}

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe((devices) => {
      console.log(devices);
      this.devices = devices;
    });
  }

  addDevice() {
    console.log('add device');
    this.deviceService.addTokenToLocalStorage(
      'a61b38f3878dc1607ea4d373c2894144'
    );
  }
}
