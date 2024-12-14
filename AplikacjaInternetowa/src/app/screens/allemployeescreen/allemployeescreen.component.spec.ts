import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllemployeescreenComponent } from './allemployeescreen.component';
import { HttpClient } from '@angular/common/http';

describe('AllemployeescreenComponent', () => {
  let component: AllemployeescreenComponent;
  let fixture: ComponentFixture<AllemployeescreenComponent>;

  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      imports: [AllemployeescreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })

      .compileComponents();

    fixture = TestBed.createComponent(AllemployeescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
