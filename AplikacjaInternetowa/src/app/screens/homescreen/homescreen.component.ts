import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, Subscription  } from 'rxjs';
import {switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css'],
  imports: [CommonModule],
  standalone: true,
  animations: [
    trigger('scroll', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(-100%)' })),
      transition('start => end', [animate('{{duration}}ms')], { params: { duration: 5000 } }),
      transition('end => start', [animate('{{duration}}ms')], { params: { duration: 5000 } }),
    ])
  ]
})

export class HomeComponent implements OnInit, AfterViewInit {

  isBrowser: boolean = false;
  userEmail: string = '';
  sessionToken: any;
  isAdmin: boolean = false;
  notifications: any[] = [];
  contentWidth: number = 0;
  containerWidth: number = 0; // Zmieniamy na 0 na początku
  scrollState: string = 'start';

  userEmail$: Observable<string | null>;
  isAdmin$: Observable<boolean | null>;

  private subscriptions: Subscription = new Subscription(); // Subscription manager


  constructor(
    private router: Router,
    private apiService: ApiConnectionService,
    private userService: UserService
  ) {
    this.isBrowser = typeof window !== 'undefined';
    this.userEmail$ = this.userService.userEmail$;
    this.isAdmin$ = this.userService.isAdmin$;
  }
  
  ngOnInit(): void {
    this.sessionToken = this.userService.getSessionToken() || null;
    this.userEmail$.pipe(
      tap(email => this.userEmail = email || ''),
      switchMap(email => {
        if (email && this.sessionToken) {
          // Return the observable if conditions are met
          console.log("Pobrano notyfickacje")
          return this.fetchNotifications();
          
        }
        // Return an empty observable if conditions are not met
        return of([]);
      })
    ).subscribe();

    this.isAdmin$.subscribe(admin => {
      this.isAdmin = admin || false; // Default to false if admin is null
    });
  }

  ngAfterViewInit(): void {
    // Przypisz wartości zależne od `window` po załadowaniu widoku
    if (this.isBrowser) {
      this.containerWidth = window.innerWidth - 32;
      this.startScrolling();
    }
  }

  fetchNotifications(): Observable<any[]> {
    return this.apiService.homeFetchNotifications(this.sessionToken, this.userEmail).pipe(
      tap(data => {
        this.notifications = data;
        // Set contentWidth here if needed
        // this.contentWidth = ... (example)
      })
    );
  }

  startScrolling(): void {
    if (this.contentWidth > this.containerWidth) {
      setTimeout(() => this.scrollState = 'end', 1000);
    }
  }

  handleNotificationPress(): void {
    this.router.navigate(['/Notificationdonescreen'], { queryParams: { userEmail: this.userEmail } });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout(): void {
    // Clear any session or authentication-related data
    this.userService.clearSession(); // Ensure you have this method in your UserService
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userEmail');
    
    // Navigate to login
    this.router.navigate(['/login']);

    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }
}
