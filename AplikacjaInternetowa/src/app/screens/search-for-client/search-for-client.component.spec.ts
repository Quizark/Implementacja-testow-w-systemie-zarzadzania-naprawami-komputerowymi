import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForClientComponent } from './search-for-client.component';

describe('SearchForClientComponent', () => {
  let component: SearchForClientComponent;
  let fixture: ComponentFixture<SearchForClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
