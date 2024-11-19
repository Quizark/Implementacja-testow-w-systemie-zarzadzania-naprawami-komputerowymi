import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addreportscreen',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addreportscreen.component.html',
  styleUrl: './addreportscreen.component.css'
})
export class AddreportscreenComponent implements OnInit {
  reportForm: FormGroup;
  emails: string[] = [];
  filteredEmails: string[] = [];
  sessionToken: string | null = null;
  needPhotosDevice = false;
  needPhotosDamage = false;
  isCodeAssigned = false;
  apiResponseData: any = null;

  yesOpacityWork = 1;
  noOpacityWork = 1;
  yesOpacityComplete = 1;
  noOpacityComplete = 1;
  yesOpacityDamage = 1;
  noOpacityDamage = 1;
  yesOpacityCode = 1;
  noOpacityCode = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiConnection: ApiConnectionService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.fb.group({
      email: ['', Validators.required],
      deviceWork: [null, Validators.required],
      deviceComplete: [null, Validators.required],
      visibleDamage: [null, Validators.required],
      codeNumber: [''],
      description: ['', Validators.required],
      employee: [''],
    });
  }

  ngOnInit(): void {
    this.userService.sessionToken$.subscribe(token => {
      this.sessionToken = token;
      if (this.sessionToken) {
        this.apiConnection.fetchEmails(this.sessionToken).subscribe({
          next: (emails: string[]) => { 
            this.emails = emails;
            this.filteredEmails = emails;
            
          },
          error: err => console.error('Błąd podczas pobierania e-maili:', err)
        });
      }
    });
    // Subskrypcja do userEmail$
    this.userService.userEmail$.subscribe(userEmail => {
      this.reportForm.get('employee')?.setValue(userEmail);
    });
  }


  handleYesPress(field: string, yesOpacity: number, noOpacity: number) {
    this.reportForm.get(field)?.setValue('Yes');
    yesOpacity = 1;
    noOpacity = 0.5;
  }

  handleNoPress(field: string, yesOpacity: number, noOpacity: number) {
    this.reportForm.get(field)?.setValue('No');
    yesOpacity = 0.5;
    noOpacity = 1;
  }

  isSubmitting = false; // Dodaj zmienną flagi

  handleSubmit(): void {
    if (this.isSubmitting) return; // Sprawdź flagę
    this.isSubmitting = true; // Ustaw flagę przed wysłaniem

    if (this.reportForm.valid && this.sessionToken) {
      const formValues = this.reportForm.value;
      this.apiConnection.addNewReport(formValues, this.isCodeAssigned, this.sessionToken).subscribe({
        next: (response) => {
          this.apiResponseData = response;
          
          this.snackBar.open('Report added successfully', 'Close', { duration: 3000 });
          if (this.needPhotosDamage || this.needPhotosDevice) {
            
            this.router.navigate(['/Addreportphotosscreen'], { state: { reportData: this.apiResponseData } });
            
          }
          else {
            this.router.navigate(['/home']); // Nawigacja po dodaniu raportu
            
          }
          this.isSubmitting = false; // Resetuj flagę po wysłaniu
        },
        error: (error: { message: string }) => {
          console.error('Error:', error);
          this.snackBar.open('Failed to add report: ' + error.message, 'Close', { duration: 3000 });
          this.isSubmitting = false; // Resetuj flagę po błędzie
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

}
