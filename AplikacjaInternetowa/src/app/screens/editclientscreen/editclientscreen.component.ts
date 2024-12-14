import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-client',
  templateUrl: './editclientscreen.component.html',
  styleUrls: ['./editclientscreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditclientscreenComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: string;
  sessionToken!: string;
  client: any = {};  // Upewniamy się, że client jest zawsze zainicjowany

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService
  ) { }

  ngOnInit() {
    const sessionToken = this.userService.getSessionToken();
    this.sessionToken = sessionToken || '';

    // Safely access history.state.client
    const navigationData = history.state?.client || {}; // Default to an empty object if undefined
    this.client = navigationData;

    // Sprawdzamy, czy client zawiera wymagane dane przed inicjalizacją formularza
    this.clientForm = this.fb.group({
      name: [this.client?.name || '', Validators.required],
      surname: [this.client?.surname || '', Validators.required],
      email: [this.client?.email || '', [Validators.required, Validators.email]],
      phone: [this.client?.phone || '', Validators.required],
    });
  }

  initializeForm(client: any): void {
    this.clientForm.patchValue({
      name: client.name,
      surname: client.surname,
      email: client.email,
      phone: client.phone,
    });
  }

  handleSave() {
    const { name, surname, email, phone } = this.clientForm.value;
    this.apiConnectionService.saveClient(
      this.sessionToken,
      this.client.id,
      name,
      surname,
      email,
      phone
    ).subscribe(() => {
      window.history.back();
    });
  }

  handleDelete() {
    this.apiConnectionService.deleteClient(this.client.id, this.sessionToken).subscribe(() => {
      window.history.back();
    });
  }

  goBack() {
    window.history.back();
  }
}
