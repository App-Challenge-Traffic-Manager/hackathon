import { Component, Input } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { IDevice } from 'src/app/interfaces/device.interface';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.scss'],
})
export class EditLabelComponent {
  @Input()
  public placeholder!: string;

  @Input()
  public token!: string;

  public input!: string;

  constructor(private readonly deviceService: DeviceService) {}

  submitLabel() {
    this.deviceService
      .updateName(this.token, this.input)
      .subscribe((device: IDevice) => {});
  }
}
