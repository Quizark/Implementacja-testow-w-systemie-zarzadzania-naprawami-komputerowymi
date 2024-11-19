import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterscreenComponent } from './registerscreen.component';

describe('RegisterscreenComponent', () => {
  let component: RegisterscreenComponent;
  let fixture: ComponentFixture<RegisterscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
