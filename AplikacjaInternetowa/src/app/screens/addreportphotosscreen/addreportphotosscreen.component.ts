import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  reportData: any;
  private sessionTokenSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private apiConnection: ApiConnectionService
  ) { }

  ngOnInit(): void {
    this.reportData = history.state.reportData;
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
    console.log("this.reportData: ",this.reportData);
    const deviceCode = this.reportData.Device?.id; // Replace with actual code

    this.sessionTokenSubscription = this.userService.sessionToken$.pipe(take(1)).subscribe((sessionToken) => {
      console.log('Session Token: ', sessionToken);
      console.log('selectedPhoto: ', this.selectedPhoto);
      console.log('deviceCode: ', deviceCode);

      if (sessionToken && this.selectedPhoto) {
        this.apiConnection.uploadPhoto(sessionToken, deviceCode, this.selectedPhoto)
          .subscribe({
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
    // Clean up subscription to avoid memory leaks
    if (this.sessionTokenSubscription) {
      this.sessionTokenSubscription.unsubscribe();
    }
  }
}
