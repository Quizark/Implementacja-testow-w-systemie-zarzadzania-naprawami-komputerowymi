import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkprogressdetialscreenComponent } from './workprogressdetialscreen.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('WorkprogressdetialscreenComponent', () => {
  let component: WorkprogressdetialscreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialscreenComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'history', {
      value: {
        state: { device: [{ email: 'test@example.com' }] },
        pushState: () => {}
      },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [
        WorkprogressdetialscreenComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' }, queryParams: {} },
            paramMap: of({ get: () => '123' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set deviceData from history.state', () => {
    expect(component.deviceData).toEqual([{ email: 'test@example.com' }]);
  });
});
