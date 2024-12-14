import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllclientscreenComponent } from './allclientscreen.component';
import { HttpClient } from '@angular/common/http';

describe('AllclientscreenComponent', () => {
  let component: AllclientscreenComponent;
  let fixture: ComponentFixture<AllclientscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    await TestBed.configureTestingModule({
      imports: [AllclientscreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AllclientscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
