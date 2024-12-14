import { TestBed } from '@angular/core/testing';
import { ApiConnectionService } from './api-connection.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importujemy HttpClientTestingModule
import { HttpClient } from '@angular/common/http';

describe('ApiConnectionService', () => {
  let service: ApiConnectionService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Tworzymy mock HttpClient
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    // Konfigurujemy testowy moduł
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Dodajemy HttpClientTestingModule
      providers: [
        ApiConnectionService,  // Zapewniamy provider dla ApiConnectionService
        { provide: HttpClient, useValue: mockHttpClient }  // Zapewniamy mock HttpClient
      ]
    });

    service = TestBed.inject(ApiConnectionService);  // Inicjalizujemy usługę
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
