import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpraypaintButtonComponent } from './spraypaint-button.component';

describe('SprayButtonComponent', () => {
  let component: SpraypaintButtonComponent;
  let fixture: ComponentFixture<SpraypaintButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpraypaintButtonComponent],
      imports: [FontAwesomeModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpraypaintButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
