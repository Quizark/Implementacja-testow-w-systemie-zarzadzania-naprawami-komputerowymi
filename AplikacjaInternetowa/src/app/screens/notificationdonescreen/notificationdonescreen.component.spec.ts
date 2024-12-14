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

  it('should update tasks after marking a task as done', () => {
    // Given:
    mockApiService.markTaskAsDone.and.returnValue(of({}));
    const fetchTasksSpy = spyOn(component, 'fetchTasks').and.callThrough();

    // When:
    component.markTaskAsDone('1');

    // Then:
    expect(mockApiService.markTaskAsDone).toHaveBeenCalledWith('session-token', '1');
    expect(fetchTasksSpy).toHaveBeenCalled();
  });

  it('should log error when fetching tasks fails', () => {
    // Given:
    const consoleSpy = spyOn(console, 'error');
    mockApiService.fetchTasks.and.returnValue(throwError(() => new Error('Fetch error')));

    // When:
    component.fetchTasks();

    // Then:
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching tasks', jasmine.any(Error));
  });
});
