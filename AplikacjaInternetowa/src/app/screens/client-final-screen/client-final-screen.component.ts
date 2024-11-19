import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-final-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-final-screen.component.html',
  styleUrls: ['./client-final-screen.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ClientFinalScreenComponent {
  deviceData: any;

  constructor(private route: ActivatedRoute) {
    // Odbierz dane z poprzedniego komponentu
    const navigationData = history.state.deviceData;
    if (navigationData) {
      this.deviceData = navigationData;
    }
  }
}
