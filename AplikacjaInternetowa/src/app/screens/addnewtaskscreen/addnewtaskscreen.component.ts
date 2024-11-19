import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-service.service';
import { Employee } from '../../interfaces/Employee.interface';
import { Device } from '../../interfaces/Device.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './addnewtaskscreen.component.html',
  styleUrls: ['./addnewtaskscreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule]
})
export class AddnewtaskscreenComponent implements OnInit {
  taskForm: FormGroup;
  employees: Employee[] = [];
  devices: Device[] = [];
  selectedEmployeeName: string = 'None';
  selectedDeviceCode: string = 'None';
  sessionToken: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private router: Router,
    private userService: UserService,
  ) {
    this.taskForm = this.fb.group({
      selectedEmployee: [''],
      selectedDevice: [''],
      taskDescription: ['']
    });
  }

  ngOnInit(): void {
    this.userService.sessionToken$.subscribe(token => {
      this.sessionToken = token || '';
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    if (!this.sessionToken) {
      console.error('No session token available.');
      return;
    }

    this.apiService.fetchEmployees(this.sessionToken).subscribe(data => {
      this.employees = data;
    });
    this.apiService.fetchDevices(this.sessionToken).subscribe(data => {
      this.devices = data;
    });

    this.taskForm.get('selectedEmployee')?.valueChanges.subscribe(value => {
      this.selectedEmployeeName = this.employees.find(e => e.id === value)?.name || 'None';
    });

    this.taskForm.get('selectedDevice')?.valueChanges.subscribe(value => {
      this.selectedDeviceCode = this.devices.find(d => d.id === value)?.codeNumber || 'None';
    });
  }

  handleSubmit(): void {
    const formData = this.taskForm.value;
    const employee = this.employees.find(e => e.id === formData.selectedEmployee);
    const device = this.devices.find(d => d.id === formData.selectedDevice);

    if (!employee || !device) {
      console.error('Employee or device not found.');
      return;
    }

    const taskData = {
      employeeEmail: employee.email,
      deviceCodeNumber: device.codeNumber,
      taskDescription: formData.taskDescription
    };

    this.apiService.handleTaskSubmit(this.sessionToken, employee.email, device.codeNumber, formData.taskDescription, ).subscribe({
      next: () => window.history.back(),
      error: err => console.error('Error submitting task:', err)
    });
    alert("Task set")
  }

  goBack(): void {
    window.history.back();
  }
}
