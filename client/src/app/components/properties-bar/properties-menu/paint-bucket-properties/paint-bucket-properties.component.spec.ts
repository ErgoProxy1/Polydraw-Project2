import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { PaintBucketPropertiesComponent } from './paint-bucket-properties.component';

describe('PaintBucketPropertiesComponent', () => {
  let component: PaintBucketPropertiesComponent;
  let fixture: ComponentFixture<PaintBucketPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintBucketPropertiesComponent ],
      imports: [FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
