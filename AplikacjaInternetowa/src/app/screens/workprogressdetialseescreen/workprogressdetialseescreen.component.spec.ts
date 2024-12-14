import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkprogressdetialseescreenComponent } from './workprogressdetialseescreen.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';

describe('WorkprogressdetialseescreenComponent', () => {
  let component: WorkprogressdetialseescreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialseescreenComponent>;
  let apiConnectionService: jasmine.SpyObj<ApiConnectionService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Mocking ApiConnectionService and UserService
    const apiSpy = jasmine.createSpyObj('ApiConnectionService', ['fetchDeviceDetails', 'fetchDevicePhotos']);
    const userSpy = jasmine.createSpyObj('UserService', ['getSessionToken']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiConnectionService, useValue: apiSpy },
        { provide: UserService, useValue: userSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ deviceId: '123' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialseescreenComponent);
    component = fixture.componentInstance;
    apiConnectionService = TestBed.inject(ApiConnectionService) as jasmine.SpyObj<ApiConnectionService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    // Mock session token
    userService.getSessionToken.and.returnValue('mockSessionToken');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch device details on init', () => {
    apiConnectionService.fetchDeviceDetails.and.returnValue(of([])); // Mocking the API response
    component.ngOnInit();
    expect(apiConnectionService.fetchDeviceDetails).toHaveBeenCalledWith('mockSessionToken', '123');
  });

  it('should fetch photos on togglePhotos()', () => {
    apiConnectionService.fetchDevicePhotos.and.returnValue(of([])); // Mocking the API response
    component.togglePhotos();
    expect(apiConnectionService.fetchDevicePhotos).toHaveBeenCalled();
    expect(component.showPhotos).toBeTrue();
  });

  it('should call fetchDeviceDetails and fetchPhotos on refresh()', () => {
    // Mocking the API responses
    apiConnectionService.fetchDeviceDetails.and.returnValue(of([]));
    apiConnectionService.fetchDevicePhotos.and.returnValue(of([]));
  
    // Setting photosLoaded to true to trigger fetchPhotos
    component.photosLoaded = true;
  
    // Calling refresh
    component.refresh();
  
    // Check if both methods are called
    expect(apiConnectionService.fetchDeviceDetails).toHaveBeenCalled();
    expect(apiConnectionService.fetchDevicePhotos).toHaveBeenCalled();
  });
  
});
