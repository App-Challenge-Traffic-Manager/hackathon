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
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
})
export class CardInfoComponent {
  @Input()
  download!: string;
  @Input()
  upload!: string;

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

  constructor() {}
}
