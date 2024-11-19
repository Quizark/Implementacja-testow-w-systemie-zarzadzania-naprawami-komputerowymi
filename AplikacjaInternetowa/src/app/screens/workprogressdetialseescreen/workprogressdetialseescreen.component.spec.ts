import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprogressdetialseescreenComponent } from './workprogressdetialseescreen.component';

describe('WorkprogressdetialseescreenComponent', () => {
  let component: WorkprogressdetialseescreenComponent;
  let fixture: ComponentFixture<WorkprogressdetialseescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkprogressdetialseescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkprogressdetialseescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
