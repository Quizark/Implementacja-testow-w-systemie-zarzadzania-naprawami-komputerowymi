import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreportscreenComponent } from './addreportscreen.component';
import { HttpClient } from '@angular/common/http';

describe('AddreportscreenComponent', () => {
  let component: AddreportscreenComponent;
  let fixture: ComponentFixture<AddreportscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    await TestBed.configureTestingModule({
      imports: [AddreportscreenComponent],
      providers: [
              { provide: HttpClient, useValue: mockHttpClient }
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreportscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
