import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StampPropertiesComponent } from './stamp-properties.component';

describe('StampPropertiesComponent', () => {
  let component: StampPropertiesComponent;
  let fixture: ComponentFixture<StampPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampPropertiesComponent ],
      imports: [FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Properly initialized', () => {
    expect(component.stamp).not.toBeUndefined();
    expect(component.scale).toBe(100);
    expect(component.rotationAngle).toBe(0);
  });

  it('Rotation change is properly handled', () => {
    component.rotationAngle = 15;
    component.onChangeRotation();
    expect(component.stamp.angle = 15);

    component.rotationAngle = -5;
    component.onChangeRotation();
    expect(component.rotationAngle).toBe(0);
    expect(component.stamp.angle).toBe(0);

    component.rotationAngle = 360;
    component.onChangeRotation();
    expect(component.rotationAngle).toBe(359);
    expect(component.stamp.angle).toBe(359);
  });

  it('Scale change is properly handled', () => {
    component.scale = 125;
    component.onChangeScale();
    expect(component.stamp.scale = 125);

    component.scale = 350;
    component.onChangeScale();
    expect(component.scale).toBe(300);
    expect(component.stamp.scale).toBe(300);

    component.scale = 10;
    component.onChangeScale();
    expect(component.scale).toBe(25);
    expect(component.stamp.scale).toBe(25);
  });

  it('Stamp change is properly handled', () => {
    component.onChangeStamp('Heart');
    expect(component.stamp.selected).toBe(4);
  });

  it('Angle is properly applied when received', () => {
    component.applyRotation(15);
    expect(component.rotationAngle).toBe(15);

    component.applyRotation(-5);
    expect(component.rotationAngle).toBe(355);

    component.applyRotation(380);
    expect(component.rotationAngle).toBe(0);
  });
});
