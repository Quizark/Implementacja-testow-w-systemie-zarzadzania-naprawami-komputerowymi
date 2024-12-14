import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationdonescreenComponent } from './notificationdonescreen.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('NotificationdonescreenComponent', () => {
  let component: NotificationdonescreenComponent;
  let fixture: ComponentFixture<NotificationdonescreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    
    // Mock the HttpClient methods to return observables
    mockHttpClient.get.and.returnValue(of([]));
    mockHttpClient.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [NotificationdonescreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationdonescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
