import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IApplication } from 'src/app/interfaces/application.interface';
import { RoutingService } from 'src/app/routing.service';
import { ApplicationService } from 'src/app/services/application.service';
import { SocketService } from 'src/app/services/socket.service';
export interface IMessage {
  upload: string;
  download: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input()
  public app!: IApplication;

  id!: String;
  name!: String;
  pid!: number;

  download!: string;
  upload!: string;

  testeObs!: any;

  private dataSubscription!: Subscription;
  private routerSubscription!: Subscription;

  public regex = new RegExp('^([0-9])+(.)([0-9])+([A-z])([A-z])$');

  testRegex(text: string) {
    var response = this.regex.test(text);
    return response;
  }

  formatValue(text: string) {
    if (!text) return '';
    return this.testRegex(text)
      ? text.substring(0, text.length - 2)
      : text.substring(0, text.length - 1);
  }

  formatUnit(text: string) {
    if (!text) return '';
    return this.testRegex(text)
      ? text.substring(text.length - 2, text.length)
      : text.substring(text.length - 1, text.length);
  }

  constructor(
    private readonly router: Router,
    private readonly applicationService: ApplicationService,
    private readonly socketService: SocketService,
    private readonly ngZone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.startLoopFunction();

    this.applicationService
      .fetchApplication(this.app.id.toString())
      .subscribe((application: IApplication) => {
        this.id = application.id;
        this.name = application.name;
        this.pid = application.pid;
        this.extractFromMessage({
          upload: application.upload,
          download: application.download,
        });
      });

    this.dataSubscription = this.socketService
      .listen(`application/${this.app.id}/size`)
      .subscribe((data: IMessage) => {
        this.extractFromMessage(data);
      });
  }

  startLoopFunction() {
    this.ngZone.runOutsideAngular(() => {
      const intervalId = setInterval(() => {
        this.applicationService
          .fetchApplication(this.app.id.toString())
          .subscribe((application: IApplication) => {
            this.id = application.id;
            this.name = application.name;
            this.pid = application.pid;
            this.extractFromMessage({
              upload: application.upload,
              download: application.download,
            });
          });
      }, 1000);

      this.ngZone.run(() => {
        this.stopLoopFunction = () => {
          clearInterval(intervalId);
        };
      });
    });
  }

  stopLoopFunction() {}

  navigate() {
    this.router.navigate(['/details'], { queryParams: { app: this.app.id } });
  }

  extractFromMessage(message: IMessage) {
    this.download = message.download;
    this.upload = message.upload;
  }

  onClick() {
    this.navigate();
  }
}
