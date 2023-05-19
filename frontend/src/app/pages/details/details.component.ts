import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IApplication } from 'src/app/interfaces/application.interface';
import { IHostTraffic } from 'src/app/interfaces/host-traffic.interface';
import { IProtocolTraffic } from 'src/app/interfaces/protocol-traffic.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { SocketService } from 'src/app/services/socket.service';

export interface ISpeed {
  value: number;
  unit: string;
  timestamp?: Date;
}

export interface IMessage {
  upload: number;
  download: number;
}

export interface IChartData {
  labels: (string | undefined)[];
  download: number[];
  upload: number[];
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  id!: String;
  name!: String;
  pid!: number;
  date!: String;
  uptime!: String;
  public protocol_traffic: IProtocolTraffic[] = [];
  public host_traffic: IHostTraffic[] = [];

  download: ISpeed[] = [];
  upload: ISpeed[] = [];

  private dataSubscription!: Subscription;

  constructor(
    private readonly routeActiv: ActivatedRoute,
    private readonly router: Router,
    private readonly applicationService: ApplicationService,
    private readonly socketService: SocketService
  ) {}

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.routeActiv.queryParams.subscribe((params) => {
      this.id = params['app'];
    });
    this.applicationService
      .fetchApplication(this.id.toString())
      .subscribe((application: IApplication) => {
        this.protocol_traffic = application.protocol_traffics;
        this.host_traffic = application.host_traffics;
        this.date = application.started_at.split(',')[0];
        this.uptime = application.started_at.split(',')[1].replace(' ', '');
        this.name = application.name;
        this.pid = application.pid;
        this.extractFromMessage({
          upload: application.upload_speed,
          download: application.download_speed,
        });
      });

    this.dataSubscription = this.socketService
      .listen(`application/${this.id}/speed`)
      .subscribe((data: IMessage) => {
        this.extractFromMessage(data);
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

  extractFromMessage(message: IMessage) {
    this.download.push({
      value: message.download,
      unit: 'B/s',
      timestamp: new Date(),
    });

    this.upload.push({
      value: message.upload,
      unit: 'B/s',
      timestamp: new Date(),
    });
  }

  navigate() {
    this.router.navigate(['/home']);
  }

  get data(): IChartData {
    return {
      labels: this.download.map((speed) =>
        speed.timestamp?.toLocaleTimeString()
      ),
      download: this.download.map((speed) => speed.value),
      upload: this.upload.map((speed) => speed.value),
    };
  }
}
