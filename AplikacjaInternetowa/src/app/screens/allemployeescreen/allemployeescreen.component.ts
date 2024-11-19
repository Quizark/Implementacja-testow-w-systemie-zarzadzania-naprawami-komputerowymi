import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service.service';
import { Employee } from '../../interfaces/Employee.interface';

@Component({
  selector: 'app-all-employee-screen',
  standalone: true,
  templateUrl: './allemployeescreen.component.html',
  styleUrls: ['./allemployeescreen.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AllemployeescreenComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiConnectionService: ApiConnectionService,
    private router: Router,
    private userService: UserService,
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
    this.subscriptions.add(
      this.searchForm.get('searchQuery')!.valueChanges.subscribe(query => {
        this.filteredEmployees = this.filterEmployees(query);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchEmployees(): void {
    const sessionToken = this.userService.getSessionToken();
    if (sessionToken === null) {
      console.error('Session token is null or UserEmail is null');
      return;
    }
    this.apiConnectionService.fetchEmployees(sessionToken).subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.filteredEmployees = this.filterEmployees(this.searchForm.get('searchQuery')!.value);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterEmployees(query: string): any[] {
    const lowerQuery = query.toLowerCase();
    return this.employees.filter(employee =>
      employee.name.toLowerCase().includes(lowerQuery) ||
      employee.surname.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery)
    );
  }

  handleSearch(): void {
    // Handle search form submission if needed
  }

  refreshEmployees(): void {
    this.loading = true;
    this.fetchEmployees();
  }

  editEmployee(employee: any): void {
    //console.log("state: { employee }", {state: { employee }})
    this.router.navigate(['/Editemployeescreen'], { state: { employee } });
  }

  goBack(): void {
    window.history.back();
  }
}
