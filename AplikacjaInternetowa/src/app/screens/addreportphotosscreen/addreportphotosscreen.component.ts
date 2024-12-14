import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addreportphotosscreen',
  standalone: true,
  templateUrl: './addreportphotosscreen.component.html',
  styleUrls: ['./addreportphotosscreen.component.css'],
  imports: [CommonModule],
})
export class AddreportphotosscreenComponent implements OnInit, OnDestroy {
  selectedPhoto: File | null = null;
  selectedPhotoUrl: string | null = null;
  reportData: any = {}; // Initializing as an empty object to avoid errors
  private sessionTokenSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private apiConnection: ApiConnectionService
  ) {}

  ngOnInit(): void {
    // Ensure reportData exists
    this.reportData = history.state?.reportData || {};
    if (!this.reportData || !this.reportData.Device) {
      // Handle the case when reportData is not properly passed
      console.error('No report data or device information available.');
    }
  }

  handleAddPhotos(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedPhoto = file;
        this.selectedPhotoUrl = URL.createObjectURL(file);
      }
    };
    input.click();
  }

  handleSubmit(): void {
    if (!this.reportData?.Device) {
      alert('Device data is missing!');
      return;
    }

    const deviceCode = this.reportData.Device?.id;

    this.sessionTokenSubscription = this.userService.sessionToken$.pipe(take(1)).subscribe((sessionToken) => {
      if (sessionToken && this.selectedPhoto) {
        console.log('Session Token: ', sessionToken);
        console.log('selectedPhoto: ', this.selectedPhoto);
        console.log('deviceCode: ', deviceCode);

        this.apiConnection.uploadPhoto(sessionToken, deviceCode, this.selectedPhoto).subscribe({
          next: () => alert('Photo uploaded successfully'),
          error: (error) => alert('Failed to upload photo: ' + error.message)
        });
      } else {
        alert('No photo selected or session token missing');
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.sessionTokenSubscription) {
      this.sessionTokenSubscription.unsubscribe();
    }
  }
}
