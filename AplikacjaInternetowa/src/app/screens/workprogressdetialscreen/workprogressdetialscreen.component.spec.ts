import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
    mockUserService = jasmine.createSpyObj('UserService', ['getSessionToken', 'setSessionToken', 'checkAdminStatus']);

    // Mocks history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: { device: [{ email: 'test@example.com' }] },
        pushState: () => { }
      },
      writable: true
    });

    // Zamockowanie metody fetchPersonDataByEmail
    mockApiService.fetchPersonDataByEmail.and.returnValue(of({ email: 'test@example.com' }));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        WorkprogressdetialscreenComponent, 
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' }, queryParams: {} },
            paramMap: of({ get: () => '123' })
          }
        },
        { provide: ApiConnectionService, useValue: mockApiService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(localStorage, 'setItem');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set deviceData from history.state', () => {
    expect(component.deviceData).toEqual([{ email: 'test@example.com' }]);
  });

  it('should not call fetchPersonDataByEmail if session token is missing', () => {
    // Given:
    mockUserService.getSessionToken.and.returnValue(null);
  
    // When:
    component.ngOnInit();
  
    // Then:
    expect(mockApiService.fetchPersonDataByEmail).not.toHaveBeenCalled();
    expect(component.personData).toEqual({}); // Upewnij się, że personData jest puste
  });
  
  it('should log error if session token is null', () => {
    // Given:
    mockUserService.getSessionToken.and.returnValue(null);
  
    const consoleSpy = spyOn(console, 'error');
  
    // When:
    component.ngOnInit();
  
    // Then:
    expect(consoleSpy).toHaveBeenCalledWith('Session token is null');
  });
});
