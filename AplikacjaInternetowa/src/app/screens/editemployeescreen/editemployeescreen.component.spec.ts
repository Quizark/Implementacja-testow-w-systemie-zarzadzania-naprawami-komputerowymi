import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditemployeescreenComponent } from './editemployeescreen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EditemployeescreenComponent', () => {
  let component: EditemployeescreenComponent;
  let fixture: ComponentFixture<EditemployeescreenComponent>;

  beforeEach(async () => {
    // Mock history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: {
          employee: {
            id: '123',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            specialization: 'Engineering',
            isAdmin: true,
          }
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        EditemployeescreenComponent,
        HttpClientTestingModule // Dodajemy HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' }, queryParams: {} }, // Mockujemy snapshot.params
            paramMap: of({ get: (key: string) => (key === 'id' ? '123' : null) }) // Mock paramMap
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditemployeescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
