import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { DeviceService } from 'src/app/services/device.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditLabelComponent } from './edit-label/edit-label.component';
import { CardInfoComponent } from './card-info/card-info.component';



@NgModule({
  declarations: [
    HomeComponent, CardComponent, EditLabelComponent, CardInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DeviceService],
})
export class HomeModule { }
