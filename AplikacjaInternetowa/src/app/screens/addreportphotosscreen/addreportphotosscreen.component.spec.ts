import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs'; 
import { AddreportphotosscreenComponent } from './addreportphotosscreen.component';
import { HttpClient } from '@angular/common/http';

describe('AddreportphotosscreenComponent', () => {
  let component: AddreportphotosscreenComponent;
  let fixture: ComponentFixture<AddreportphotosscreenComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    await TestBed.configureTestingModule({
      imports: [AddreportphotosscreenComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreportphotosscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
