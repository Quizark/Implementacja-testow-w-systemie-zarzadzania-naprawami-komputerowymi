import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprogressscreenComponent } from './workprogressscreen.component';

describe('WorkprogressscreenComponent', () => {
  let component: WorkprogressscreenComponent;
  let fixture: ComponentFixture<WorkprogressscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkprogressscreenComponent]
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
