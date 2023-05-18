import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  public date:String = '18/05/2023'
  public uptime:String = '02:14';
  protocol_traffic = [
    {
      name: 'HTTP',
      download: '202.20KB',
      upload: '00.02KB'
    },
    {
      name: 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      download: '202.20KB',
      upload: '00.02KB'
    },
    {
      name: 'TCP',
      download: '202.20KB',
      upload: '00.02KB'
    },
  ];
  host_traffic = [
    {
      name: '192.168.10.101',
      download: '202.20KB',
      upload: '00.02KB'
    },
    {
      name: 'Specific Hosts',
      download: '202.20KB',
      upload: '00.02KB'
    },
    {
      name: 'Specific Ports',
      download: '202.20KB',
      upload: '00.02KB'
    },
  ];

  constructor(private readonly router: Router) {}
  navigate() {
    this.router.navigate(['/home']);
  }

  public regex = new RegExp('^([0-9])+(.)([0-9])+([A-z])([A-z])$');

  testRegex(text: string) {
    var response = this.regex.test(text);
    return response;
  }

  formatValue(text: string) {
    return this.testRegex(text)
      ? text.substring(0, text.length - 2)
      : text.substring(0, text.length - 1);
  }

  formatUnit(text:string) {
    return this.testRegex(text)
      ? text.substring(text.length - 2, text.length)
      : text.substring(text.length - 1, text.length);
  }
}
