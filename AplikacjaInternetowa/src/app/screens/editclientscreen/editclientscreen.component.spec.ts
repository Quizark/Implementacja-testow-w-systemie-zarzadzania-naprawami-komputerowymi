import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditclientscreenComponent } from './editclientscreen.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('EditclientscreenComponent', () => {
  let component: EditclientscreenComponent;
  let fixture: ComponentFixture<EditclientscreenComponent>;

  beforeEach(async () => {
    const mockHistoryState = {
      client: {
        id: '123',
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      },
    };

    // Mockowanie history.state przy użyciu Object.defineProperty
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
      imports: [
        EditclientscreenComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
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

    fixture = TestBed.createComponent(EditclientscreenComponent);
    component = fixture.componentInstance;

    // Wymuszamy inicjalizację komponentu
    fixture.detectChanges();  // Sprawia, że ngOnInit zostanie wywołane
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
