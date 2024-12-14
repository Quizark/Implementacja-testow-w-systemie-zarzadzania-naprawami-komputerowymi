import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForClientComponent } from './search-for-client.component';
import { HttpClient } from '@angular/common/http';

describe('SearchForClientComponent', () => {
  let component: SearchForClientComponent;
  let fixture: ComponentFixture<SearchForClientComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      imports: [SearchForClientComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
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
