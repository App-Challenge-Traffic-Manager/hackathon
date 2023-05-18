import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { DeviceService } from 'src/app/services/device.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, CardComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DeviceService],
})
export class HomeModule {}
