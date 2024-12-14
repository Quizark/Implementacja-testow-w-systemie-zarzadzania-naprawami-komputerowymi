import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterscreenComponent } from './registerscreen.component';
import { HttpClient } from '@angular/common/http';

describe('RegisterscreenComponent', () => {
  let component: RegisterscreenComponent;
  let fixture: ComponentFixture<RegisterscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      imports: [RegisterscreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
