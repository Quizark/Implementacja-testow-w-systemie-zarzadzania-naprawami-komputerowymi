import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service.service';
import { Clients } from '../../interfaces/Clients.inteface';
@Component({
  selector: 'app-all-client-screen',
  templateUrl: './allclientscreen.component.html',
  styleUrls: ['./allclientscreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AllclientscreenComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  clients: Clients[] = [];
  filteredClients: any[] = [];
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
    
    this.fetchClients();
    this.subscriptions.add(
      this.searchForm.get('searchQuery')!.valueChanges.subscribe(query => {
        this.filteredClients = this.filterClients(query);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchClients(): void {
    const sessionToken = this.userService.getSessionToken();
    if (sessionToken === null ) {
      console.error('Session token is null or UserEmail is null');
      return;
    }
    this.apiConnectionService.fetchClients(sessionToken).subscribe({
      next: (clients: Clients[]) => { // Correctly typing the response here
        this.clients = clients;
        this.filteredClients = this.filterClients(this.searchForm.get('searchQuery')!.value);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterClients(query: string): any[] {
    const lowerQuery = query.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.surname.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      client.phone.toLowerCase().includes(lowerQuery)
    );
  }

  handleSearch(): void {
    // Handle search form submission if needed
  }

  refreshClients(): void {
    this.loading = true;
    this.fetchClients();
  }

  editClient(client: any): void {
    this.router.navigate(['/Editclientscreen'], {state: {client}});
  }

  goBack(): void {
    window.history.back();
  }
}
