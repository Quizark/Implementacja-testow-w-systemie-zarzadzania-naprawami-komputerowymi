import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprogressscreenComponent } from './workprogressscreen.component';
import { HttpClient } from '@angular/common/http';

describe('WorkprogressscreenComponent', () => {
  let component: WorkprogressscreenComponent;
  let fixture: ComponentFixture<WorkprogressscreenComponent>;

  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      imports: [WorkprogressscreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkprogressscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
