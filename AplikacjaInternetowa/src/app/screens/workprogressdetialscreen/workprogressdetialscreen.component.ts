import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-work-progress-detail-screen',
  templateUrl: './workprogressdetialscreen.component.html',
  styleUrls: ['./workprogressdetialscreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class WorkprogressdetialscreenComponent implements OnInit {
  deviceData: any;
  personData: any = {};
  clientForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private userService: UserService,
  ) {
    this.clientForm = this.fb.group({
      clientName: [''],
      clientSurname: [''],
      clientEmail: [''],
      clientPhone: ['']
    });
  }

  ngOnInit(): void {
    const sessionToken = this.userService.getSessionToken();

    this.deviceData = history.state.device;
    console.log('Received device data:', this.deviceData);
    if (sessionToken === null) {
      console.error('Session token is null');
      return;
    }
    //Pobieranie danych o kliencie
    this.apiService.fetchPersonDataByEmail(this.deviceData[0]?.email, sessionToken).subscribe(
      (data: any) => {
        this.personData = data;
        console.log("personData", this.personData);
        this.updateForm();
      },
      (error) => {
        console.error('Error fetching person data:', error);
      }
    );
  }

  updateForm(): void {
    this.clientForm.patchValue({
      clientName: this.personData.name || '',
      clientSurname: this.personData.surname || '',
      clientEmail: this.deviceData[0]?.email || '',
      clientPhone: this.personData.phone || 'N/A'
    });
  }

  navigateToWorkSee(deviceId: string): void {
    this.router.navigate(['Workprogressdetialseescreen'], { queryParams: { deviceId } });
  }

  goBack(): void {
    window.history.back();
  }
}