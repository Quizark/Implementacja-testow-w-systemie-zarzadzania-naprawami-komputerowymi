import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreportscreenComponent } from './addreportscreen.component';

describe('AddreportscreenComponent', () => {
  let component: AddreportscreenComponent;
  let fixture: ComponentFixture<AddreportscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddreportscreenComponent]
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
