import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, tap, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Employee } from '../interfaces/Employee.interface';
import { Device } from '../interfaces/Device.interface';
import { Clients } from '../interfaces/Clients.inteface';
import { Task } from '../interfaces/Task.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Register new user
  registerUser(userData: {
    name: string;
    surname: string;
    specialization: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const { name, surname, specialization, email, password, confirmPassword } = userData;

    // Client-side validation
    if (!this.validateName(name) || !this.validateSurname(surname) || !this.validateEmail(email) || !this.validatePassword(password, confirmPassword)) {
      return throwError(() => new Error('Validation failed'));
    }

    const hashedPassword = CryptoJS.SHA256(password).toString();

    const reportData = {
      name,
      surname,
      specialization: specialization.trim().length < 1 ? 'None' : specialization,
      email,
      password: hashedPassword,
    };

    return this.http.post(`${this.baseUrl}/users/register`, reportData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Login function
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.baseUrl}/users/login`, loginData).pipe(
      catchError(this.handleError)
    );
  }

  // Register a new person
  registerPerson(personData: { name: string; surname: string; email: string; phone: string }, sessionToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.post(`${this.baseUrl}/persons/create`, personData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Helper validation methods
  private validateName(name: string): boolean {
    return name.length >= 3 && name.length <= 25;
  }

  private validateSurname(surname: string): boolean {
    return surname.length >= 3 && surname.length <= 30;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string, confirmPassword: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    return passwordRegex.test(password) && password === confirmPassword;
  }

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error?.message || 'Something went wrong'));
  }

  addNewReport(reportData: {
    email: string;           // email w reportData
    deviceWork: string;
    deviceComplete: string;
    visibleDamage: string;
    codeNumber: string;
    description: string;
    employee: string;        // userEmail w reportData
  }, isCodeAssigned: boolean, sessionToken: string) {
    console.log("Still working! Ostatni");
    const now = new Date();
    const formattedDate = this.formatDate(now); // Wywołanie funkcji formatDate w serwisie

    const reportDataWithDate = {
      ...reportData,
      date: formattedDate,  // Przypisanie sformatowanej daty do pola date
    };

    let link = `${this.baseUrl}/devices/create`;
    //console.log("isCodeAssigned should be true/false: ", isCodeAssigned);
    if (!isCodeAssigned) {
      link = `${this.baseUrl}/devices/createNew`;
      //console.log("isCodeAssigned should be false: ", isCodeAssigned);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });
    //console.log("Sending data: ", reportDataWithDate);
    //console.log("Sending link: ", link);
    return this.http.post(link, reportDataWithDate, { headers }).pipe(
      tap((response: any) => {
        //console.log('Response from server: ', response);
        if (response && response.Device && response.Device.codeNumber) {
          alert(`Device code number: ${response.Device.codeNumber}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }


  fetchEmails(sessionToken: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.get<string[]>(`${this.baseUrl}/persons/emails`, { headers }).pipe(
      tap(response => console.log('Odpowiedź z API: ', response)), // Dodaj logowanie odpowiedzi //DO USUNIECIA WYWOŁANIE W KONSOLI
      catchError(this.handleError)
    );
  }

  // Upload photo
  uploadPhoto(sessionToken: string, deviceCode: string, selectedPhoto: File) {
    const formData = new FormData();
    formData.append('file', selectedPhoto);
    formData.append('deviceCode', deviceCode);
    console.log("file: ", selectedPhoto, 'deviceCode: ', deviceCode)
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.post(`${this.baseUrl}/upload`, formData, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Upload error:', error);
        return throwError(() => new Error('Upload failed'));
      })
    );
  }

  // Search codes by email
  searchCodesByEmail(email: string, sessionToken: string) {
    if (!email) {
      return throwError(() => new Error('Email cannot be empty'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.get(`${this.baseUrl}/devices/getDeviceIdByEmail/${email}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Search device by code
  searchDeviceByCode(codeNumber: string, sessionToken: string) {
    if (!codeNumber) {
      return throwError(() => new Error('Code number cannot be empty'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.get(`${this.baseUrl}/devices/${codeNumber}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch person data by email
  fetchPersonDataByEmail(email: string, sessionToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });
    console.log("link", `${this.baseUrl}/persons/email/${email}`);
    return this.http.get(`${this.baseUrl}/persons/email/${email}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie pracowników
  fetchEmployees(sessionToken: string): Observable<Employee[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken
    });

    return this.http.get<Employee[]>(`${this.baseUrl}/users/all`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie urządzeń
  fetchDevices(sessionToken: string): Observable<Device[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken
    });

    return this.http.get<Device[]>(`${this.baseUrl}/devices`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Tworzenie zadania
  handleTaskSubmit(
    sessionToken: string,
    selectedEmployee: string,
    selectedDevice: string,
    taskDescription: string
  ) {
    if (!selectedEmployee || !selectedDevice) {
      return throwError(() => new Error('Please select an employee and a device.'));
    }



    const taskData = {
      employeeEmail: selectedEmployee,
      deviceCodeNumber: selectedDevice,
      taskDescription,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.post(`${this.baseUrl}/tasks`, taskData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie klientów
  fetchClients(sessionToken: string): Observable<Clients[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken
    });

    return this.http.get<Clients[]>(`${this.baseUrl}/persons`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Usuwanie klienta
  deleteClient(sessionToken: string, clientId: string) {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.delete(`${this.baseUrl}/persons/${clientId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Aktualizacja klienta
  saveClient(sessionToken: string, clientId: string, name: string, surname: string, email: string, phone: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    const clientData = {
      name,
      surname,
      email,
      phone,
    };

    return this.http.put(`${this.baseUrl}/persons/${clientId}`, clientData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // Zmiana uprawnień administratora
  toggleAdmin(
    sessionToken: string,
    employeId: string,
    name: string,
    surname: string,
    email: string,
    specialization: string,
    isAdmin: boolean
  ) {
    const newIsAdmin = !isAdmin;
    const updatedData = { name, surname, email, specialization, isAdmin: newIsAdmin };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.put(`${this.baseUrl}/users/${employeId}`, updatedData, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  // Usunięcie pracownika
  deleteEmployee(sessionToken: string, employeId: string) {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.delete(`${this.baseUrl}/users/${employeId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Aktualizacja pracownika
  saveEmployee(
    sessionToken: string,
    employeId: string,
    name: string,
    surname: string,
    email: string,
    specialization: string,
    isAdmin: boolean
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    const updatedData = { name, surname, email, specialization, isAdmin };
    console.log('EmployeeId: ', employeId);
    return this.http.put(`${this.baseUrl}/users/${employeId}`, updatedData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie powiadomień
  fetchNotifications(sessionToken: string, userEmail: string) {
    if (!userEmail) {
      return throwError(() => new Error('User email is required.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.get(`${this.baseUrl}/tasks/user/${userEmail}/incomplete`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Oznaczanie zadania jako wykonane
  markTaskAsDone(sessionToken: string, taskId: string) {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.put(`${this.baseUrl}/tasks/done/${taskId}`, null, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie zadań
  fetchTasks(sessionToken: string, userEmail: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.get<any[]>(`${this.baseUrl}/tasks/user/${userEmail}/incomplete`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Usuwanie zadania
  deleteTask(sessionToken: string, taskId: string) {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.delete(`${this.baseUrl}/tasks/${taskId}`, { headers, responseType: 'text' }).pipe(
      map(response => response || {}), // response jest tekstem, ale jeśli nie ma treści, zwróć pusty obiekt
      catchError(this.handleError)
    );
  }

  // Pobieranie zadań z serwera
  fetchAllTasks(sessionToken: string): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.get<Task[]>(`${this.baseUrl}/tasks`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie szczegółów urządzenia
  fetchDeviceDetails(sessionToken: string, deviceId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });

    return this.http.get<any[]>(`${this.baseUrl}/details/byDeviceId`, {
      headers,
      params: { deviceId },
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Pobieranie zdjęć dla urządzenia
  fetchDevicePhotos(sessionToken: string, deviceId: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': sessionToken,
    });
  
    return this.http.get<string[]>(`${this.baseUrl}/upload/photos`, {
      headers,
      params: { deviceCode: deviceId },
    }).pipe(
      catchError(this.handleError),
      mergeMap((fileIds: string[]) => {
        // Tworzymy żądania dla każdego pliku
        const photoRequests: Observable<string>[] = fileIds.map(fileId => {
          return this.http.get(`${this.baseUrl}/upload/files`, {
            headers,
            params: { id: fileId },
            responseType: 'blob',
          }).pipe(
            mergeMap(blob => this.convertBlobToBase64(blob)) // Spłaszczamy blob do Base64
          );
        });
        // Używamy forkJoin, aby połączyć wszystkie strumienie i zwrócić wynik jako Observable<string[]>
        return forkJoin(photoRequests);  // Tu forkJoin zwróci Observable<string[]>
      })
    );
  }
  
  private convertBlobToBase64(blob: Blob): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Base64 image:', reader.result); // Logowanie base64 zdjęcia
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.readAsDataURL(blob);
    });
  }


  // Aktualizacja urządzenia
  updateDevice(sessionToken: string, deviceId: string, description: string, employee: string) {
    const date = new Date().toLocaleString('pl-PL', { hour12: false });
    const data = { deviceId, date, description, employee };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    });

    return this.http.post(`${this.baseUrl}/details/add`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  homeFetchNotifications(token: string, email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks/user/${email}/incomplete`, {
      headers: { Authorization: `${token}` }
    });
  }

  getDeviceWithDetails(codeNumber: string, email: string, sessionToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionToken}` // Dodaj token autoryzacyjny, jeśli wymagany
    });

    return this.http.get<any>(`${this.baseUrl}/devices/deviceWithDetails?codeNumber=${codeNumber}&email=${email}`, { headers });
  }
}
