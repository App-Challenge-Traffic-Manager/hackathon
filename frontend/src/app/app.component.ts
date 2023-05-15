import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

export enum Layouts {
  Centered,
  Dashboard,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  Layouts = Layouts;
  layout = Layouts;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        this.layout =
          data.state.root.firstChild?.data['layout'] || Layouts.Dashboard;
      }
    });
  }
}
