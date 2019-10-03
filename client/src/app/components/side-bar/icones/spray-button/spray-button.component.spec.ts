import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SprayButtonComponent } from './spray-button.component';

describe('SprayButtonComponent', () => {
  let component: SprayButtonComponent;
  let fixture: ComponentFixture<SprayButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SprayButtonComponent],
      imports: [FontAwesomeModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
