import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from './user-service.service'; // Dodaj właściwą ścieżkę

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080'; // Zamień na swój URL API

  constructor(private http: HttpClient, private userService: UserService) {}

  checkToken(): Observable<boolean> {
    return this.userService.sessionToken$.pipe(
      switchMap(token => {
        if (!token) {
          return of(false); // Jeśli token nie istnieje, zwróć od razu false
        }
        const headers = new HttpHeaders().set('Authorization', `${token}`);
        return this.http.get<{ message: string }>(`${this.apiUrl}/users/verify`, { headers }).pipe(
          map(response => response.message === 'Session is valid'),
          catchError(() => of(false)) // Jeśli wystąpi błąd, uznajemy token za nieważny
        );
      })
    );
  }
}
