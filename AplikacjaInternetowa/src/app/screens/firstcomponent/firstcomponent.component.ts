import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-firstcomponent',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './firstcomponent.component.html',
  styleUrl: './firstcomponent.component.css',
  encapsulation:ViewEncapsulation.ShadowDom
})
export class FirstcomponentComponent {

  constructor(private router: Router) { }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateToSearchForClient(): void {
    this.router.navigate(['/SearchForClient']);
  }

}
