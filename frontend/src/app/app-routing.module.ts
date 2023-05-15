import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';

export enum Pages {
  Home = 'home',
}

const routes: Routes = [
  {
    path: '',
    redirectTo: Pages.Home,
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: Pages.Home, component: HomeComponent }],
  },
  {
    path: Pages.Home,
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
