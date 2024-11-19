import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFinalScreenComponent } from './client-final-screen.component';

describe('ClientFinalScreenComponent', () => {
  let component: ClientFinalScreenComponent;
  let fixture: ComponentFixture<ClientFinalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFinalScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFinalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
