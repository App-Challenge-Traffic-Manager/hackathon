import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  devices = [
    {
      deviceId: '1324654136',
      deviceName: 'Device 1',
      data: [
        {
          title: 'Angular',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
        {
          title: 'React',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
        {
          title: 'Java',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
      ],
    },
    {
      deviceId: '1324654136',
      deviceName: 'Device 2',
      data: [
        {
          title: 'Angular',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
        {
          title: 'React',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
      ],
    },
    {
      deviceId: '1324654136',
      deviceName: 'Device 3',
      data: [
        {
          title: 'Angular',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
        {
          title: 'React',
          downloadSize: 22.5,
          uploadSize: 12.3,
          upDate: '16/05/2023',
          upTime: '3123',
        },
      ],
    },
  ];
}
