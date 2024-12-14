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
    // Mockowane dane zadań
    const mockTasks = [
      { deviceCodeNumber: '123', taskDescription: 'Naprawa', employeeEmail: 'employee@example.com', isDone: false },
      { deviceCodeNumber: '456', taskDescription: 'Serwis', employeeEmail: 'employee2@example.com', isDone: true },
    ];
    component.tasks = mockTasks;
  
    // Ustawienie zapytania do wyszukiwania
    const query = 'naprawa';
    component.handleSearch(query);
  
    // Sprawdzanie, czy `filteredTasks` zawiera tylko jedno zadanie
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].taskDescription).toBe('Naprawa');
  });
  
});
