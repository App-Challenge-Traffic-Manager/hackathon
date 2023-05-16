import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [
    HomeComponent, CardComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class HomeModule { }
