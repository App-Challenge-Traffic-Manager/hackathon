import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IApplication } from 'src/app/interfaces/application.interface';
import { RoutingService } from 'src/app/routing.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input()
  public app!: IApplication;

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

  constructor(private readonly router: Router, private readonly routingService:RoutingService) {}

  navigate() {
    this.router.navigate(['/details'], { queryParams: { app: this.app.id }});
  }

  onClick(){
    this.navigate();
  }
}
