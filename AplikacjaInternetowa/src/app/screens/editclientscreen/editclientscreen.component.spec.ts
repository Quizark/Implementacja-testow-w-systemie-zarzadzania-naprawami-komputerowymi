import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditclientscreenComponent } from './editclientscreen.component';

describe('EditclientscreenComponent', () => {
  let component: EditclientscreenComponent;
  let fixture: ComponentFixture<EditclientscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditclientscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditclientscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
