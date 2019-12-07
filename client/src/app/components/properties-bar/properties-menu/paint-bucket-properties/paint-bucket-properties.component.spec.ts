// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
// tslint:disable-next-line: max-line-length
import { MAX_PAINT_BUCKET_TOLERANCE, MAX_STROKE_WIDTH, MIN_PAINT_BUCKET_TOLERANCE, MIN_STROKE_WIDTH, PaintBucketType, StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { RoutingConstants } from 'src/app/services/utils/routingConstants';
import { PaintBucketPropertiesComponent } from './paint-bucket-properties.component';

describe('PaintBucketPropertiesComponent', () => {
  let component: PaintBucketPropertiesComponent;
  let fixture: ComponentFixture<PaintBucketPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaintBucketPropertiesComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: RoutingConstants.ROUTE_TO_PAINT_BUCKET, component: PaintBucketPropertiesComponent },
        { path: RoutingConstants.ROUTE_TO_PAINT_BUCKET + '/:bucketType', component: PaintBucketPropertiesComponent },
      ])],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setInputValue = (selector: string, value: string) => {
    const input = fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the width of the input should be the same than the bucket object', async(() => {
    fixture.whenStable().then(() => {
      const input = fixture.nativeElement.querySelector('#strokewidthRange');
      fixture.detectChanges();
      expect(input.value).toBe(String(component.paintBucketTool.strokeWidth));
      expect(input.value).toBe(String(component.strokeWidth));
    });
  }));

  it('Should set width to minimum', () => {
    setInputValue('#strokewidthRange', String(MIN_STROKE_WIDTH - 1));
    expect(component.paintBucketTool.strokeWidth).toEqual(MIN_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);

    setInputValue('#strokewidthRange', String(MIN_STROKE_WIDTH));
    expect(component.paintBucketTool.strokeWidth).toEqual(MIN_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);

    setInputValue('#strokewidthRange', String(-123));
    expect(component.paintBucketTool.strokeWidth).toEqual(MIN_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);

    component.strokeWidth = MIN_STROKE_WIDTH - 11;
    component.onChangeStrokeWidth();
    expect(component.paintBucketTool.strokeWidth).toEqual(MIN_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('Should set width to maximum', () => {
    setInputValue('#strokewidthRange', String(MAX_STROKE_WIDTH + 1));
    expect(component.paintBucketTool.strokeWidth).toEqual(MAX_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);

    setInputValue('#strokewidthRange', String(MAX_STROKE_WIDTH));
    expect(component.paintBucketTool.strokeWidth).toEqual(MAX_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);

    setInputValue('#strokewidthRange', String(123));
    expect(component.paintBucketTool.strokeWidth).toEqual(MAX_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);

    component.strokeWidth = MAX_STROKE_WIDTH + 11;
    component.onChangeStrokeWidth();
    expect(component.paintBucketTool.strokeWidth).toEqual(MAX_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });

  it('Should set width to correct value', () => {
    setInputValue('#strokewidthRange', String(34));
    expect(component.paintBucketTool.strokeWidth).toEqual(34);
    expect(component.strokeWidth).toEqual(34);

    setInputValue('#strokewidthRange', String(22));
    expect(component.paintBucketTool.strokeWidth).toEqual(22);
    expect(component.strokeWidth).toEqual(22);

    setInputValue('#strokewidthRange', String(45));
    expect(component.paintBucketTool.strokeWidth).toEqual(45);
    expect(component.strokeWidth).toEqual(45);
  });

  it('the tolerance of the input should be the same than the bucket object', async(() => {
    fixture.whenStable().then(() => {
      const input = fixture.nativeElement.querySelector('#toleranceRange');
      fixture.detectChanges();
      expect(input.value).toBe(String(component.paintBucketTool.tolerance));
      expect(input.value).toBe(String(component.tolerance));
    });
  }));

  it('Should set tolerance to minimum', () => {
    setInputValue('#toleranceRange', String(MIN_PAINT_BUCKET_TOLERANCE - 1));
    expect(component.paintBucketTool.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);

    setInputValue('#toleranceRange', String(MIN_PAINT_BUCKET_TOLERANCE));
    expect(component.paintBucketTool.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);

    setInputValue('#toleranceRange', String(-123));
    expect(component.paintBucketTool.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);

    component.tolerance = MIN_PAINT_BUCKET_TOLERANCE - 11;
    component.onChangeTolerance();
    expect(component.paintBucketTool.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MIN_PAINT_BUCKET_TOLERANCE);
  });

  it('Should set tolerance to maximum', () => {
    setInputValue('#toleranceRange', String(MAX_PAINT_BUCKET_TOLERANCE + 1));
    expect(component.paintBucketTool.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);

    setInputValue('#toleranceRange', String(MAX_PAINT_BUCKET_TOLERANCE));
    expect(component.paintBucketTool.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);

    setInputValue('#toleranceRange', String(123));
    expect(component.paintBucketTool.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);

    component.tolerance = MAX_PAINT_BUCKET_TOLERANCE + 11;
    component.onChangeTolerance();
    expect(component.paintBucketTool.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);
    expect(component.tolerance).toEqual(MAX_PAINT_BUCKET_TOLERANCE);
  });

  it('Should set tolerance to correct value', () => {
    setInputValue('#toleranceRange', String(34));
    expect(component.paintBucketTool.tolerance).toEqual(34);
    expect(component.tolerance).toEqual(34);

    setInputValue('#toleranceRange', String(22));
    expect(component.paintBucketTool.tolerance).toEqual(22);
    expect(component.tolerance).toEqual(22);

    setInputValue('#toleranceRange', String(45));
    expect(component.paintBucketTool.tolerance).toEqual(45);
    expect(component.tolerance).toEqual(45);
  });

  it('stroke type should be properly updated', () => {
    const currentType  = component.strokeType;
    component.onChangeStrokeType();
    expect(component.paintBucketTool.strokeType).toBe(currentType);

    component.strokeType = StrokeType.Outline;
    component.onChangeStrokeType();
    expect(component.paintBucketTool.strokeType).toBe(StrokeType.Outline);

    component.strokeType = 999;
    component.onChangeStrokeType();
    expect(component.strokeType).toBe(StrokeType.Outline);
  });

  it('paint bucket type should be properly updated', () => {
    component.paintBucketType = PaintBucketType.Fill;
    component.onChangePaintBucketType();
    expect(component.isFill).toBe(true);
    expect(component['toolType']).toBe(ToolType.PaintBucket);

    component.paintBucketType = PaintBucketType.Applicator;
    component.onChangePaintBucketType();
    expect(component.isFill).toBe(false);
    expect(component['toolType']).toBe(ToolType.ColorApplicator);
  });
});
