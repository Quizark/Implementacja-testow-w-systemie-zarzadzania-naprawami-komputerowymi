import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewclientscreenComponent } from './addnewclientscreen.component';

describe('AddnewclientscreenComponent', () => {
  let component: AddnewclientscreenComponent;
  let fixture: ComponentFixture<AddnewclientscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddnewclientscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewclientscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
