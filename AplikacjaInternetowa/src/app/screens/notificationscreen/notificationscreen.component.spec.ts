import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationscreenComponent } from './notificationscreen.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs'; // Import `of` to create mock observables

describe('NotificationscreenComponent', () => {
  let component: NotificationscreenComponent;
  let fixture: ComponentFixture<NotificationscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    // Mock the HttpClient methods to return observables
    mockHttpClient.get.and.returnValue(of([])); // Return an empty array or suitable mock data
    mockHttpClient.post.and.returnValue(of({})); // Return an empty object or suitable mock response

    await TestBed.configureTestingModule({
      imports: [NotificationscreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should filter tasks based on search query', () => {
    // Given:
    const mockTasks = [
      { deviceCodeNumber: '123', taskDescription: 'Naprawa', employeeEmail: 'employee@example.com', isDone: false },
      { deviceCodeNumber: '456', taskDescription: 'Serwis', employeeEmail: 'employee2@example.com', isDone: true },
    ];
    component.tasks = mockTasks;

    // When: 
    const query = 'naprawa';
    component.handleSearch(query);

    // Then: 
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].taskDescription).toBe('Naprawa');
  });
  it('Checking if the task list is loaded', () => {
    // Given: 
    const mockTasks = [
      { id: '1', deviceCodeNumber: '123', taskDescription: 'Naprawa', employeeEmail: 'employee@example.com', isDone: false },
      { id: '2', deviceCodeNumber: '456', taskDescription: 'Serwis', employeeEmail: 'employee2@example.com', isDone: true },
    ];

    spyOn(component['apiService'], 'fetchAllTasks').and.returnValue(of(mockTasks));

    // When: 
    component.loadTasks();

    // Then: 
    expect(component.tasks).toEqual(mockTasks);
    expect(component.filteredTasks).toEqual(mockTasks);
  });

});
