import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-progress-screen',
  standalone: true,
  templateUrl: './workprogressscreen.component.html',
  styleUrls: ['./workprogressscreen.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class WorkprogressscreenComponent implements OnInit{
  workForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiConnectionService: ApiConnectionService,
    private userService: UserService,
    private router: Router
  ) {
    this.workForm = this.fb.group({
      codeNumber: [''],
      email: ['']
    });
  }
  ngOnInit(): void {
    
   
  }

  async handleDeviceSearch() {
    console.log("Przycisk CODE działa!");
    const sessionToken = this.userService.getSessionToken();
    const codeNumber = this.workForm.get('codeNumber')?.value;
    console.log("sessionToken: ", sessionToken);
    console.log("codeNumber: ", codeNumber);
  
    if (sessionToken === null) {
      console.error('Session token is null');
      return;
    }
  
    try {
      const deviceData = await this.apiConnectionService.searchDeviceByCode(codeNumber, sessionToken).toPromise();
      console.log('Fetched device data:', deviceData);
      // Przekazanie danych do ekranu "workprogressdetialscreen"
      this.router.navigate(['/Workprogressdetailscreen'], { state: { device: deviceData } });
    } catch (error) {
      console.error('Error fetching device:', error);
    }
  }

  async handleEmailSearch() {
    console.log("Przycisk EMAIL działa!");
    const email = this.workForm.get('email')?.value;
    const sessionToken = this.userService.getSessionToken();
    console.log("sessionToken: ", sessionToken);
    console.log("email: ", email);
    
    if (sessionToken === null) {
      // Obsłuż przypadek, gdy token sesji jest null
      console.error('Session token is null');
      alert('Session token is missing.');
      return;
    }
    
    try {
      const result = await this.apiConnectionService.searchCodesByEmail(email, sessionToken).toPromise();
      // Jeśli operacja zakończyła się sukcesem
      alert('Search completed successfully!\nCode numbers: '+result);
      console.log('Result:', result);
    } catch (error) {
      // Obsłuż przypadek błędu
      alert('An error occurred while searching for the email.');
      console.error('Error:', error);
    }
  }

  goBack() {
    this.router.navigate(['/home']); 
  }

  
}
