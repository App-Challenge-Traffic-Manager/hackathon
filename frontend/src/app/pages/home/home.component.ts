import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDevice } from 'src/app/interfaces/device.interface';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  myForm!: FormGroup;
  devices: IDevice[] = [];

  constructor(private readonly deviceService: DeviceService) {}

  ngOnInit(): void {
    this.myForm = new FormGroup({
      deviceId: new FormControl('', [Validators.required]),
    });
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  onSubmit() {
    this.deviceService.addTokenToLocalStorage(
      this.myForm.controls['deviceId'].value
    );
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }
}
