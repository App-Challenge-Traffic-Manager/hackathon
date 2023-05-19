import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplication } from 'src/app/interfaces/application.interface';
import { IHostTraffic } from 'src/app/interfaces/host-traffic.interface';
import { IProtocolTraffic } from 'src/app/interfaces/protocol-traffic.interface';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  date!: String;
  uptime!: String;
  protocol_traffic!: IProtocolTraffic[];
  host_traffic!: IHostTraffic[];

  constructor(
    private readonly routeActiv: ActivatedRoute,
    private readonly router: Router,
    private readonly applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.routeActiv.queryParams.subscribe((params) => {
      console.log(params['app']);
    });
    this.applicationService
      .fetchApplication('68ee00d3-af27-429d-9142-fc195faae2d5')
      .subscribe((application: IApplication) => {
        this.protocol_traffic = application.protocol_traffics;
        this.host_traffic = application.host_traffics;
        this.date = application.started_at.split(',')[0];
        this.uptime = application.started_at.split(',')[1].replace(' ', '');
      });
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

  formatUnit(text: string) {
    return this.testRegex(text)
      ? text.substring(text.length - 2, text.length)
      : text.substring(text.length - 1, text.length);
  }

  navigate() {
    this.router.navigate(['/home']);
  }
}
