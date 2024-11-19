import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreportphotosscreenComponent } from './addreportphotosscreen.component';

describe('AddreportphotosscreenComponent', () => {
  let component: AddreportphotosscreenComponent;
  let fixture: ComponentFixture<AddreportphotosscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddreportphotosscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreportphotosscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
