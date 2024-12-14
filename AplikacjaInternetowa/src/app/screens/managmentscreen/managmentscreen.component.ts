import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managment-screen',
  templateUrl: './managmentscreen.component.html',
  styleUrls: ['./managmentscreen.component.css'],
  standalone: true,
})
export class ManagmentscreenComponent {

  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  goBack(): void {
    window.history.back();
  }
}
