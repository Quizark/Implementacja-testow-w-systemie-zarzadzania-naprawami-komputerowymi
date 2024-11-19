import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewtaskscreenComponent } from './addnewtaskscreen.component';

describe('AddnewtaskscreenComponent', () => {
  let component: AddnewtaskscreenComponent;
  let fixture: ComponentFixture<AddnewtaskscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddnewtaskscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewtaskscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
