import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Observable, Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-progress-detail-see',
  templateUrl: './workprogressdetialseescreen.component.html',
  styleUrls: ['./workprogressdetialseescreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class WorkprogressdetialseescreenComponent implements OnInit, OnDestroy {
  deviceId!: string;
  deviceDetails: any[] = [];
  photos: string[] = [];
  showPhotos = false;
  loading = false;
  photosLoaded = false; // Nowy stan do śledzenia, czy zdjęcia zostały już pobrane
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.deviceId = params['deviceId'];
      console.log("deviceId", this.deviceId);
      console.log("params['deviceId']", params['deviceId']);

      this.fetchDeviceDetails();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchDeviceDetails(): void {
    const sessionToken = this.userService.getSessionToken();
    if (sessionToken === null) {
      console.error('Session token is null');
      return;
    }
    this.apiConnectionService.fetchDeviceDetails(sessionToken, this.deviceId)
      .subscribe(details => {
        this.deviceDetails = details;
      });
  }

  fetchPhotos(): void {
    this.loading = true;
    const sessionToken = this.userService.getSessionToken();
    if (sessionToken === null) {
      console.error('Session token is null');
      return;
    }
    this.apiConnectionService.fetchDevicePhotos(sessionToken, this.deviceId)
      .subscribe(
        photos => {
          console.log('Fetched photos:', photos);  // Logowanie pobranych zdjęć
          this.photos = photos;
          this.photosLoaded = true;
          this.loading = false;
        },
        error => {
          console.error('Error fetching photos:', error);
          this.loading = false;
        }
      );
  }

  togglePhotos(): void {
    if (!this.photosLoaded) {
      this.fetchPhotos();
    }
    this.showPhotos = !this.showPhotos;
  }

  refresh(): void {
    this.fetchDeviceDetails();
    if (this.photosLoaded) {
      this.fetchPhotos();
    }
  }

  navigateToUpdate(): void {
    this.router.navigate(['/Workprogressdetialupdatescreen', { deviceId: this.deviceId }]);
  }

  goBack(): void {
    window.history.back();
  }

}