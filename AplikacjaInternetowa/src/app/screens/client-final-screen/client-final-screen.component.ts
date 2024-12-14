import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-final-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-final-screen.component.html',
  styleUrls: ['./client-final-screen.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ClientFinalScreenComponent {
  deviceData: any = { id: 'N/A', name: 'Unknown', codeNumber: 'N/A' }; // Domyślne wartości

  constructor(private route: ActivatedRoute) {
    // Pobieranie danych z history.state, jeśli istnieją
    const navigationData = history.state?.deviceData;

    if (navigationData) {
      this.deviceData = navigationData;
    }
  }
}
