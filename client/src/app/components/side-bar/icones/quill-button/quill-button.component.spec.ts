import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillButtonComponent } from './quill-button.component';

describe('QuillButtonComponent', () => {
  let component: QuillButtonComponent;
  let fixture: ComponentFixture<QuillButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuillButtonComponent],
      imports: [FontAwesomeModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
