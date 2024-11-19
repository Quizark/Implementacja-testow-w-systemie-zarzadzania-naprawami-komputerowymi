import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationdonescreenComponent } from './notificationdonescreen.component';

describe('NotificationdonescreenComponent', () => {
  let component: NotificationdonescreenComponent;
  let fixture: ComponentFixture<NotificationdonescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationdonescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationdonescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
