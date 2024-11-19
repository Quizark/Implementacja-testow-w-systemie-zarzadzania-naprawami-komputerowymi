import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprogressdetialscreenComponent } from './workprogressdetialscreen.component';

describe('WorkprogressdetialscreenComponent', () => {
  let component: WorkprogressdetialscreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkprogressdetialscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
