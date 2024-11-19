import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Upewnij się, że ścieżka jest poprawna
import { UserService } from '../../services/user-service.service';  // Upewnij się, że ścieżka jest poprawna
import { MatSnackBar } from '@angular/material/snack-bar';  // Użyj Angular Material do powiadomień
import { ApiConnectionService } from '../../services/api-connection.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule],
})
export class LoginScreenComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private apiConnection: ApiConnectionService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  handleSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login Data:', { email, password }); // Dodaj logowanie
      this.apiConnection.login(email, password).subscribe({
        next: (response) => {
          console.log('Login Response:', response); // Dodaj logowanie
          this.userService.setUserEmail(email);
          this.userService.setSessionToken(response.sessionToken);
  
          // Dodaj logowanie, aby sprawdzić, czy token jest prawidłowo ustawiany
          console.log('Token set in UserService: ', this.userService.sessionToken$);
  
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });
  
          // Sprawdź, czy router jest prawidłowo używany
          this.router.navigate(['/home']).then(success => {
            if (success) {
              console.log('Navigation to /home successful');
            } else {
              console.error('Navigation to /home failed');
            }
          });
        },
        error: (error) => {
          console.error('Login Error:', error); // Dodaj logowanie
          this.snackBar.open('Login failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
