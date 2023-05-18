import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DetailsComponent } from './pages/details/details.component';
import { HomeComponent } from './pages/home/home.component';

export enum Pages {
  Home = 'home',
  Details = 'details',
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
    children: [
      { path: Pages.Home, component: HomeComponent },
      {
        path: Pages.Details,
        component: DetailsComponent,
      },
    ],
  },
  {
    path: Pages.Home,
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: Pages.Details,
    loadChildren: () =>
      import('./pages/details/details.module').then((m) => m.DetailsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
