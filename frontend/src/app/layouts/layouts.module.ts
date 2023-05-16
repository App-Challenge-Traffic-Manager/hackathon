import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [MainLayoutComponent],
})
export class LayoutsModule {}
