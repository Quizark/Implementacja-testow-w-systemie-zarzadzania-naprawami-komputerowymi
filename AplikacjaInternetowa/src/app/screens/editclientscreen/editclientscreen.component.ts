import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-client',
  templateUrl: './editclientscreen.component.html',
  styleUrls: ['./editclientscreen.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
})
export class EditclientscreenComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: string;
  sessionToken!: string;
  client: any;
//SPRAWDZIĆ CZY TE WYKRZYKNIKI NIE PSUJĄ
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService
  ) {}

  ngOnInit() {
    
    const sessionToken = this.userService.getSessionToken();
    //POBIERANIE DANYCH O KLIENCIE Z POPRZEDNIEGO EKRANU!!!
    this.sessionToken = sessionToken || '';

    this.client = history.state.client;

    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    })
    this.initializeForm(this.client);
  }
  initializeForm(client: any): void {
    this.clientForm.patchValue({
      name: client.name,
      surname: client.surname,
      email: client.email,
      phone: client.phone
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
      phone,
      
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
