import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprogressdetialupdatescreenComponent } from './workprogressdetialupdatescreen.component';

describe('WorkprogressdetialupdatescreenComponent', () => {
  let component: WorkprogressdetialupdatescreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialupdatescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkprogressdetialupdatescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialupdatescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
