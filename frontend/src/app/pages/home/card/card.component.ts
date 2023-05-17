import { Component, Input } from '@angular/core';
import { IApplication } from 'src/app/interfaces/application.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  public app!:IApplication;

  constructor(){}
}
