import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForClientComponent } from './search-for-client.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

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
  it('should submit valid form and call API', () => {
    // Given
    const formData = { code: '123', email: 'client@example.com' };
    component.searchForm.setValue(formData);
    const mockResponse = { deviceData: 'some data' };
    spyOn(component['apiService'], 'getDeviceWithDetails').and.returnValue(of(mockResponse));
    spyOn(component['router'], 'navigate');
  
    // When
    component.handleSubmit();
  
    // Then
    expect(component['apiService'].getDeviceWithDetails).toHaveBeenCalledWith(
      formData.code, formData.email, 'your-session-token'
    );
    expect(component['router'].navigate).toHaveBeenCalledWith(
      ['/ClientFinalScreen'], { state: { deviceData: mockResponse } }
    );
  });
  
});
