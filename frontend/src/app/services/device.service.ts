import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDevice } from '../interfaces/device.interface';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private readonly http: HttpClient) {}

  getInMemoryDevices(): string[] {
    const idsJson = localStorage.getItem(environment.APP_TOKEN_STORAGE_KEY);
    const ids = JSON.parse(idsJson || '[]');
    return ids;
  }

  addTokenToLocalStorage(token: string) {
    const ids = this.getInMemoryDevices();

    ids.push(token);

    localStorage.setItem(
      environment.APP_TOKEN_STORAGE_KEY,
      JSON.stringify(ids)
    );
  }

  removeTokenFromLocalStorage(token: string) {
    const ids = this.getInMemoryDevices();
    const index = ids.indexOf(token);
    if (index > -1) {
      ids.splice(index, 1);
    }
    localStorage.setItem(
      environment.APP_TOKEN_STORAGE_KEY,
      JSON.stringify(ids)
    );
  }

  getDevices(): Observable<IDevice[]> {
    const ids = this.getInMemoryDevices();

    if (ids.length === 0) {
      return of([]);
    }
    const url = `${environment.API_URL}/devices/by-tokens?tokens=${ids.join(
      ','
    )}`;
    return this.http.get<IDevice[]>(url);
  }
}
