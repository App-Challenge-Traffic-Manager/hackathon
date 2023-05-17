import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { DeviceService } from 'src/app/services/device.service';



@NgModule({
  declarations: [
    HomeComponent, CardComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [DeviceService],
})
export class HomeModule { }
