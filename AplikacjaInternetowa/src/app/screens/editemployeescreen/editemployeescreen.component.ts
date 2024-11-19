import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-employee-screen',
  standalone: true,
  templateUrl: './editemployeescreen.component.html',
  styleUrls: ['./editemployeescreen.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditemployeescreenComponent implements OnInit {
  employeeForm!: FormGroup;
  isAdmin: boolean = false;
  employeeId: string = '';
  sessionToken: string = '';
  employee: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //console.log("ngOnInitStart");

    const sessionToken = this.userService.getSessionToken();
    this.sessionToken = sessionToken || ''; // Initialize sessionToken
    
    this.employee = history.state.employee;
    //console.log('Employee data:', this.employee);
  
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['']
    });
    //console.log("ngOnInitEnd");
    this.initializeForm(this.employee);
  }

  initializeForm(employee: any): void {
    this.employeeForm.patchValue({
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      specialization: employee.specialization
    });
    this.isAdmin = employee.isAdmin || false; // Set the admin flag if available
  }

  handleToggleAdmin(): void {
    this.apiService.toggleAdmin(this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin).subscribe(() => {
      this.isAdmin = !this.isAdmin;
    });
  }

  handleSave(): void {
    //console.log('EmployeeId before send: ', this.employee.id);
    //console.log("all: ",this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin)
    this.apiService.saveEmployee(this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin).subscribe(() => {
      this.goBack();
    });
  }

  handleDelete(): void {
    this.apiService.deleteEmployee(this.sessionToken, this.employeeId).subscribe(() => {
      this.goBack();
    });
  }

  goBack(): void {
    window.history.back();
  }
}
