import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFinalScreenComponent } from './client-final-screen.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ClientFinalScreenComponent', () => {
  let component: ClientFinalScreenComponent;
  let fixture: ComponentFixture<ClientFinalScreenComponent>;

  beforeEach(async () => {
    // Mockowanie danych w history.state w formacie, który jest wymagany przez szablon
    const mockHistoryState = {
      deviceData: {
        device: {
          id: '123',
          name: 'Device 1',
          codeNumber: '456',
          description: 'Test description',
          email: 'device1@example.com',
          deviceComplete: true,
          deviceWork: 'Work description',
          visibleDamage: 'Scratches',
          date: '2024-12-14',
        },
        details: [
          {
            date: '2024-12-14',
            description: 'Detail 1',
            employee: 'John Doe',
          },
        ],
      },
    };

    // Mockowanie właściwości history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: mockHistoryState,
        length: 0,
        scrollRestoration: 'auto',
        back: function (): void {},
        forward: function (): void {},
        go: function (delta?: number): void {},
        pushState: function (data: any, unused: string, url?: string | URL | null): void {},
        replaceState: function (data: any, unused: string, url?: string | URL | null): void {},
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [ClientFinalScreenComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' }, queryParams: {} },
            paramMap: of({ get: () => '123' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFinalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set deviceData from history.state', () => {
    expect(component.deviceData).toEqual({
      device: {
        id: '123',
        name: 'Device 1',
        codeNumber: '456',
        description: 'Test description',
        email: 'device1@example.com',
        deviceComplete: true,
        deviceWork: 'Work description',
        visibleDamage: 'Scratches',
        date: '2024-12-14',
      },
      details: [
        {
          date: '2024-12-14',
          description: 'Detail 1',
          employee: 'John Doe',
        },
      ],
    });
  });

  it('should read codeNumber from deviceData', () => {
    expect(component.deviceData.device.codeNumber).toBe('456');
  });
});
