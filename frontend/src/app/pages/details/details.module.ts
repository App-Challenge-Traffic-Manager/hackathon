import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DetailsComponent } from './details.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [DetailsComponent, LineChartComponent],
  imports: [CommonModule],
})
export class DetailsModule {}
