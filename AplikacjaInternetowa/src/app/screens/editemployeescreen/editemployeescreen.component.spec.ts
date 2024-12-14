import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditemployeescreenComponent } from './editemployeescreen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { of } from 'rxjs';

describe('EditemployeescreenComponent', () => {
  let component: EditemployeescreenComponent;
  let fixture: ComponentFixture<EditemployeescreenComponent>;
  let mockApiService: jasmine.SpyObj<ApiConnectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mockowane zależności
    mockApiService = jasmine.createSpyObj('ApiConnectionService', ['toggleAdmin', 'saveEmployee', 'deleteEmployee']);
    mockUserService = jasmine.createSpyObj('UserService', ['getSessionToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: {
          employee: {
            id: '123',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            specialization: 'Engineering',
            isAdmin: true,
          }
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, EditemployeescreenComponent],
      providers: [
        { provide: ApiConnectionService, useValue: mockApiService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
            paramMap: of({ get: (key: string) => (key === 'id' ? '123' : null) })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditemployeescreenComponent);
    component = fixture.componentInstance;

    // Mock wartości zwracanych przez UserService
    mockUserService.getSessionToken.and.returnValue('mock-session-token');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with employee data', () => {
    // Given
    const employee = {
      id: '123',
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      specialization: 'Engineering',
      isAdmin: true
    };

    // When
    fixture.detectChanges();

    // Then
    expect(component.employeeForm.value).toEqual({
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      specialization: employee.specialization
    });
    expect(component.isAdmin).toBe(employee.isAdmin);
  });

  it('should toggle admin status and update the server', () => {
    // Given
    mockApiService.toggleAdmin.and.returnValue(of({}));
    expect(component.isAdmin).toBeTrue();

    // When
    component.handleToggleAdmin();

    // Then
    expect(mockApiService.toggleAdmin).toHaveBeenCalledWith(
      'mock-session-token',
      '123',
      'John',
      'Doe',
      'john.doe@example.com',
      'Engineering',
      true
    );
    expect(component.isAdmin).toBe(false);
  });

  it('should save employee data and navigate back', () => {
    // Given
    mockApiService.saveEmployee.and.returnValue(of({}));
    spyOn(component, 'goBack');

    // When
    component.handleSave();

    // Then
    expect(mockApiService.saveEmployee).toHaveBeenCalledWith(
      'mock-session-token',
      '123',
      'John',
      'Doe',
      'john.doe@example.com',
      'Engineering',
      true
    );
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should delete employee and navigate back', () => {
    // Given
    mockApiService.deleteEmployee.and.returnValue(of({}));
    spyOn(component, 'goBack');

    // When
    component.handleDelete();

    // Then
    expect(mockApiService.deleteEmployee).toHaveBeenCalledWith('mock-session-token', '');
    expect(component.goBack).toHaveBeenCalled();
  });
});