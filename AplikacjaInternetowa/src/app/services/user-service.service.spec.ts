import { TestBed } from '@angular/core/testing';

import { UserService } from './user-service.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserServiceService', () => {
  let service: UserService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Tworzymy mock HttpClient
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    // Konfigurujemy testowy moduł
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  
      providers: [
        UserService,  
        { provide: HttpClient, useValue: mockHttpClient } 
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
