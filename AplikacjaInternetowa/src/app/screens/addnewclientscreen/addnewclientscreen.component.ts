import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service'; // Replace with your actual path
import { UserService } from '../../services/user-service.service'; // Replace with your actual path
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-addnewclientscreen',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addnewclientscreen.component.html',
  styleUrl: './addnewclientscreen.component.css'
})
export class AddnewclientscreenComponent {
  clientForm: FormGroup;
  sessionToken: string | null = null; // Initialize to null
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiConnection: ApiConnectionService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
      clientSurname: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['', Validators.required]
    });

    this.userService.sessionToken$.subscribe(token => this.sessionToken = token);
  }

  handleSubmit(): void {
    if (this.clientForm.valid && this.sessionToken) {
      const { clientName, clientSurname, clientEmail, clientPhone } = this.clientForm.value;
      this.apiConnection.registerPerson({
        name: clientName,
        surname: clientSurname,
        email: clientEmail,
        phone: clientPhone
      }, this.sessionToken).subscribe({
        next: () => {
          this.snackBar.open('Client added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/home']); // Navigate to the desired route
        },
        error: (error: { message: string; }) => {
          console.error('Error:', error);
          this.snackBar.open('Failed to add client: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']); // Navigate back or to another route
  }
}
