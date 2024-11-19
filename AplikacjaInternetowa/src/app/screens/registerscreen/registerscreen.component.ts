import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registerscreen',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registerscreen.component.html',
  styleUrl: './registerscreen.component.css'
})
export class RegisterscreenComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiConnectionService: ApiConnectionService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      specialization: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const formValue = this.registerForm.value;
    this.apiConnectionService.registerUser(formValue).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        alert('User registered successfully');
      },
      error: (error) => {
        alert('Registration failed: ' + error.message);
      },
    });
  }
  onBack() {
    this.router.navigate(['/login']);
  }
}
