import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationscreenComponent } from './notificationscreen.component';

describe('NotificationscreenComponent', () => {
  let component: NotificationscreenComponent;
  let fixture: ComponentFixture<NotificationscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
