import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaintBrushButtonComponent } from './paint-brush-button.component';

describe('PaintBrushButtonComponent', () => {
  let component: PaintBrushButtonComponent;
  let fixture: ComponentFixture<PaintBrushButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintBrushButtonComponent ],
      imports: [FontAwesomeModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBrushButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
