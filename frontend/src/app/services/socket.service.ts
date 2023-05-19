import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {
    this.socket.on('connect', (d: any) => {});
  }

  listen(event: string) {
    return new Observable((observer: Observer<any>) => {
      this.socket.on(event, (message: string) => {
        observer.next(message);
      });
    });
  }
}
