import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewtaskscreenComponent } from './addnewtaskscreen.component';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiConnectionService } from '../../services/api-connection.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddnewtaskscreenComponent', () => {
  let component: AddnewtaskscreenComponent;
  let fixture: ComponentFixture<AddnewtaskscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let mockApiConnectionService: jasmine.SpyObj<ApiConnectionService>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mockApiConnectionService = jasmine.createSpyObj('ApiConnectionService', ['registerTask']);

    

    await TestBed.configureTestingModule({
      imports: [AddnewtaskscreenComponent, BrowserAnimationsModule],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: ApiConnectionService, useValue: mockApiConnectionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddnewtaskscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
