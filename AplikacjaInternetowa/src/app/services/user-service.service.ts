// src/app/user-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private sessionTokenSubject = new BehaviorSubject<string | null>(null);

  userEmail$ = this.userEmailSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  sessionToken$ = this.sessionTokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return true; 
  }
  setUserEmail(email: string): void {
    this.userEmailSubject.next(email);
    this.checkAdminStatus(email, this.sessionTokenSubject.value);
  }

  setSessionToken(token: string | null): void {
    this.sessionTokenSubject.next(token);
    localStorage.setItem('authToken', token || '');
    this.checkAdminStatus(this.userEmailSubject.value, token);
  }

  private checkAdminStatus(email: string | null, token: string | null): void {
    if (!email || !token) {
      this.isAdminSubject.next(false);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', token);
    this.http.get<{ isAdmin: boolean }>(`http://localhost:8080/users/isAdmin/${email}`, { headers })
      .pipe(
        tap(response => this.isAdminSubject.next(response.isAdmin)),
        catchError(() => {
          this.isAdminSubject.next(false);
          return [];
        })
      ).subscribe();
  }

  getSessionToken(): string | null {
    return this.sessionTokenSubject.value;
  }
  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }
  
  clearSession(): void {
    // Clear all session-related data
    this.userEmailSubject.next(null);
    this.isAdminSubject.next(false);
    this.sessionTokenSubject.next(null);

    // Remove from localStorage
    localStorage.removeItem('authToken');
  }
}
