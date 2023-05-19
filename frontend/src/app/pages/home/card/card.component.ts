import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IApplication } from 'src/app/interfaces/application.interface';
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

  private dataSubscription!: Subscription;

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
    private readonly socketService: SocketService
  ) {}

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.id = this.app.id;
    this.name = this.app.name;
    this.pid = this.app.pid;
    this.download = this.app.download;
    this.upload = this.app.upload;
    this.dataSubscription = this.socketService
      .listen(`application/${this.app.id}/size`)
      .subscribe((data: any) => {
        this.extractFromMessage(data);
      });
  }

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
