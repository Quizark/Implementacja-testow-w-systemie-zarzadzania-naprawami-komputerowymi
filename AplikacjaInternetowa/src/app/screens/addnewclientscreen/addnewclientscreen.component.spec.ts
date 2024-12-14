import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AddnewclientscreenComponent } from './addnewclientscreen.component';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AddnewclientscreenComponent', () => {
  let component: AddnewclientscreenComponent;
  let fixture: ComponentFixture<AddnewclientscreenComponent>;
  let mockApiConnectionService: jasmine.SpyObj<ApiConnectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockApiConnectionService = jasmine.createSpyObj('ApiConnectionService', ['registerPerson']);
    mockUserService = jasmine.createSpyObj('UserService', ['sessionToken$'], { sessionToken$: of('test-token') });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddnewclientscreenComponent],
      providers: [
        { provide: ApiConnectionService, useValue: mockApiConnectionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddnewclientscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
