import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { DeviceService } from 'src/app/services/device.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent, CardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DeviceService],
})
export class HomeModule { }
