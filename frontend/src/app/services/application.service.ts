import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApplication } from '../interfaces/application.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private readonly http: HttpClient) {}


  fetchApplication(id: string): Observable<IApplication> {
    const url = `${environment.API_URL}/applications/${id}`;
    return this.http.get<IApplication>(url);
  }
}
