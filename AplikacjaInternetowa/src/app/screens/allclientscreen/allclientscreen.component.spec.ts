import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllclientscreenComponent } from './allclientscreen.component';

describe('AllclientscreenComponent', () => {
  let component: AllclientscreenComponent;
  let fixture: ComponentFixture<AllclientscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllclientscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllclientscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
