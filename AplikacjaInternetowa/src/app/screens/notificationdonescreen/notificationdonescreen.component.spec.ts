import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationdonescreenComponent } from './notificationdonescreen.component';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { of, throwError } from 'rxjs';

describe('NotificationdonescreenComponent', () => {
  let component: NotificationdonescreenComponent;
  let fixture: ComponentFixture<NotificationdonescreenComponent>;
  let mockApiService: jasmine.SpyObj<ApiConnectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiConnectionService', ['fetchTasks', 'markTaskAsDone']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserEmail', 'getSessionToken']);

    mockUserService.getUserEmail.and.returnValue('test@example.com');
    mockUserService.getSessionToken.and.returnValue('session-token');

    mockApiService.fetchTasks.and.returnValue(of([
      { id: '1', description: 'Test Task 1', isDone: false },
      { id: '2', description: 'Test Task 2', isDone: true },
    ]));

    await TestBed.configureTestingModule({
      imports: [NotificationdonescreenComponent],
      providers: [
        { provide: ApiConnectionService, useValue: mockApiService },
        { provide: UserService, useValue: mockUserService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationdonescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch tasks on initialization', () => {
    // Then:
    expect(mockApiService.fetchTasks).toHaveBeenCalledWith('session-token', 'test@example.com');
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].description).toBe('Test Task 1');
  });

  
});
