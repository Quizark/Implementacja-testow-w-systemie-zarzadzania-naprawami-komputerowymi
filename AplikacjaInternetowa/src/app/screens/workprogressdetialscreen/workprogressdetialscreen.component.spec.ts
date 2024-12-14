import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkprogressdetialscreenComponent } from './workprogressdetialscreen.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';

describe('WorkprogressdetialscreenComponent', () => {
  let component: WorkprogressdetialscreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialscreenComponent>;
  let mockApiService: jasmine.SpyObj<ApiConnectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {

    mockApiService = jasmine.createSpyObj('ApiConnectionService', ['fetchPersonDataByEmail']);
    mockUserService = jasmine.createSpyObj('UserService', ['getSessionToken']);

    Object.defineProperty(window, 'history', {
      value: {
        state: { device: [{ email: 'test@example.com' }] },
        pushState: () => { }
      },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [
        WorkprogressdetialscreenComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' }, queryParams: {} },
            paramMap: of({ get: () => '123' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set deviceData from history.state', () => {
    expect(component.deviceData).toEqual([{ email: 'test@example.com' }]);
  });

  it('should fetch person data and update form when valid session token', () => {
    // Given:
    const mockPersonData = { name: 'John', surname: 'Doe', phone: '1234567890' };
    mockUserService.getSessionToken.and.returnValue('valid-session-token');
    mockApiService.fetchPersonDataByEmail.and.returnValue(of(mockPersonData));

    // When:
    component.ngOnInit();

    // Then:
    expect(component.personData).toEqual(mockPersonData);
    expect(component.clientForm.value.clientName).toBe('John');
    expect(component.clientForm.value.clientSurname).toBe('Doe');
    expect(component.clientForm.value.clientPhone).toBe('1234567890');
  });
});
