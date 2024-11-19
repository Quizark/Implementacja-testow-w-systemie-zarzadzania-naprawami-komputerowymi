import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-progress-detail-update',
  templateUrl: './workprogressdetialupdatescreen.component.html',
  styleUrls: ['./workprogressdetialupdatescreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class WorkprogressdetialupdatescreenComponent implements OnInit {
  updateForm: FormGroup;
  deviceId!: string;
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiService: ApiConnectionService
  ) {
    this.updateForm = this.fb.group({
      description: ['']
    });
  }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') || '';
    this.updateForm.patchValue({ description: '' });
  }

  handleSubmit(): void {
    const description = this.updateForm.get('description')?.value;
    const sessionToken = this.userService.getSessionToken();
    const userEmail = this.userService.getUserEmail();
    if (sessionToken === null || userEmail  === null ) {
      console.error('Session token is null or UserEmail is null');
      return;
    }
    this.apiService.updateDevice(sessionToken, this.deviceId, description, userEmail)
      .subscribe({
        next: () => window.history.back(),
        error: (error) => console.error('Error:', error)
      });
      alert("Udane wrzucenie aktualizacji");
  }

  goBack(): void {
    window.history.back();
  }
}
