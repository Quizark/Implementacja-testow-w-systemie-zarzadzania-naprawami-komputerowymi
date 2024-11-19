import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllemployeescreenComponent } from './allemployeescreen.component';

describe('AllemployeescreenComponent', () => {
  let component: AllemployeescreenComponent;
  let fixture: ComponentFixture<AllemployeescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllemployeescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllemployeescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
