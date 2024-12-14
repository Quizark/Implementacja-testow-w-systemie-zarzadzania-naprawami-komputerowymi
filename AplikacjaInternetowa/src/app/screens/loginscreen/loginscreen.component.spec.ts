import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginScreenComponent } from './loginscreen.component';
import { HttpClient } from '@angular/common/http';

describe('LoginscreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      imports: [LoginScreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
