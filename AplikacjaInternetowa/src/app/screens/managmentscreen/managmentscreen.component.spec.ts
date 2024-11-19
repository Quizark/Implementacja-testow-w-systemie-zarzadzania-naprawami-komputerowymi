import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentscreenComponent } from './managmentscreen.component';

describe('ManagmentscreenComponent', () => {
  let component: ManagmentscreenComponent;
  let fixture: ComponentFixture<ManagmentscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagmentscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagmentscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
