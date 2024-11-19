import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-for-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-for-client.component.html',
  styleUrl: './search-for-client.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SearchForClientComponent {
  searchForm: FormGroup;
  
  constructor(
    private apiService:  ApiConnectionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      code: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  handleSubmit() {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;
      console.log('Form submitted:', formData);

      // Przekazanie danych do serwisu
      const sessionToken = 'your-session-token'; // Możesz go pobrać np. z lokalnej pamięci

      this.apiService.getDeviceWithDetails(formData.code, formData.email, sessionToken)
        .subscribe({
          next: (response) => {
            console.log('Device and details:', response);
            // Przekazanie danych do następnego ekranu
            this.router.navigate(['/ClientFinalScreen'], { state: { deviceData: response } });
          },
          error: (err) => {
            console.error('Error fetching device details:', err);
          }
        });
    } else {
      console.error('Form is invalid');
    }
  }

}
