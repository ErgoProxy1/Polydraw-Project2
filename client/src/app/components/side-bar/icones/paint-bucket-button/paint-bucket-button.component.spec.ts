import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaintBucketButtonComponent } from './paint-bucket-button.component';

describe('PaintBucketButtonComponent', () => {
  let component: PaintBucketButtonComponent;
  let fixture: ComponentFixture<PaintBucketButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintBucketButtonComponent ],
      imports: [FontAwesomeModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
