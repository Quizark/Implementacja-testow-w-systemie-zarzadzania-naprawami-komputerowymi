import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginScreenComponent } from './loginscreen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiConnectionService } from '../../services/api-connection.service';
import { of, throwError } from 'rxjs';

describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockApiConnection: jasmine.SpyObj<ApiConnectionService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['']);
    mockUserService = jasmine.createSpyObj('UserService', ['setUserEmail', 'setSessionToken']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockApiConnection = jasmine.createSpyObj('ApiConnectionService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginScreenComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ApiConnectionService, useValue: mockApiConnection }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit login form and navigate to home on success', () => {
    // Given:
    const mockResponse = { sessionToken: 'mock-token' };
    mockApiConnection.login.and.returnValue(of(mockResponse));
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });

    // When:
    component.handleSubmit();

    // Then:
    expect(mockApiConnection.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockUserService.setUserEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserService.setSessionToken).toHaveBeenCalledWith('mock-token');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Login successful', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should display an error message on login failure', () => {
    // Given:
    const mockError = { message: 'Invalid credentials' };
    mockApiConnection.login.and.returnValue(throwError(() => mockError));
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });

    // When:
    component.handleSubmit();

    // Then:
    expect(mockApiConnection.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Login failed: Invalid credentials', 'Close', { duration: 3000 });
  });
});
