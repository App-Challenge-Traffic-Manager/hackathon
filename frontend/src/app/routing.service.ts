import { Injectable } from '@angular/core';

type RoutingParams = {
  [from: string]: {
    [to: string]: {
      params: any;
      lastUpdate: Date;
    };
  };
};

@Injectable({
  providedIn: 'root',
})

export class RoutingService {
  constructor() {}

  private self: RoutingParams = {};

  public setParams(from: string, to: string, params: any) {
    this.self[from][to].params = params;
    this.self[from][to].lastUpdate = new Date();
    this.saveOnLocalStorage();
  }

  public getParams(from: string, to: string) {
    // this.self = this.loadFromLocalStorage();
    return this.self[from][to].params;
  }

  public getLastUpdate(from: string, to: string) {
    return this.self[from][to].lastUpdate;
  }

  public saveOnLocalStorage(){
    localStorage.setItem('routing', JSON.stringify(this.self));
  }

  public loadFromLocalStorage(){
    return JSON.parse(localStorage.getItem('routing') || '{}');
  }
}
