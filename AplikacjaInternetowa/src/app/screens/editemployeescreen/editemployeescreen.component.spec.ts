import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditemployeescreenComponent } from './editemployeescreen.component';

describe('EditemployeescreenComponent', () => {
  let component: EditemployeescreenComponent;
  let fixture: ComponentFixture<EditemployeescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditemployeescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditemployeescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
