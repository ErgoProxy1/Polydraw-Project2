import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { LineTool } from 'src/app/services/tools/lineTool';
import { Color } from 'src/app/services/utils/color';
import {
  DEFAULT_LINE_ROUNDING, DEFAULT_LINE_STROKE_WIDTH, LineCap,
  LineJoin, MAX_LINE_ROUNDING, MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, Pattern
} from 'src/app/services/utils/constantsAndEnums';
import { LinePropertiesComponent } from './line-properties.component';

describe('LinePropertiesComponent', () => {
  let component: LinePropertiesComponent;
  let fixture: ComponentFixture<LinePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinePropertiesComponent],
      imports: [FormsModule, HttpClientModule],
      providers: [KeyboardService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setInputValue = (selector: string, value: string) => {
    const input = fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.line.strokeWidth).toEqual(DEFAULT_LINE_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(component.line.strokeWidth);
    expect(component.circleRadius).toEqual(component.line.circleRadius);
    expect(component.pattern).toEqual(component.line.pattern);
    expect(component.lineJoin).toEqual(component.line.lineJoin);
    expect(component.lineCap).toEqual(component.line.lineCap);
    expect(component.LINE_JOIN_NAMES_MAP.size).toEqual(7);
    expect(component.PATTERN_NAMES_MAP.size).toEqual(6);
    expect(component.LINE_CAP_NAMES_MAP.size).toEqual(3);
  });

  it('should correctly update the line strokeWidth if input is a valid value', () => {
    setInputValue('#LineStrokewidthinput', String(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2)));
    expect(component.line.strokeWidth).toEqual(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2));
  });

  it('should set the line\'s strokeWidth to minimum value if input value is too low', () => {
    setInputValue('#LineStrokewidthinput', String(MIN_STROKE_WIDTH - MAX_STROKE_WIDTH));
    expect(component.line.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('should set the line\'s strokeWidth to maximum value if input value is too high', () => {
    setInputValue('#LineStrokewidthinput', String(MAX_STROKE_WIDTH + MAX_STROKE_WIDTH));
    expect(component.line.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });

  it('#onChangeStrokeWidth should change the line\'s width attribute', () => {
    const line: LineTool = new LineTool(new Color(100, 100, 100, 0.5));
    line.strokeWidth = 20;
    component.strokeWidth = line.strokeWidth;
    component.onChangeStrokeWidth();
    expect(component.strokeWidth).toEqual(20);
    expect(component.strokeWidth).toEqual(20);

    line.strokeWidth = MAX_STROKE_WIDTH;
    component.strokeWidth = line.strokeWidth;
    component.onChangeStrokeWidth();
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MAX_STROKE_WIDTH);

    line.strokeWidth = MIN_STROKE_WIDTH;
    component.strokeWidth = line.strokeWidth;
    component.onChangeStrokeWidth();
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);
    expect(component.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('#onChangePattern should change the line\'s pattern attribute', () => {
    const line: LineTool = new LineTool(new Color(100, 100, 100, 0.5));
    line.pattern = Pattern.DottedLine;
    component.pattern = line.pattern;
    component.onChangePattern();
    expect(component.pattern).toEqual(Pattern.DottedLine);
    expect(component.line.pattern).toEqual(Pattern.DottedLine);

    line.pattern = 999;
    component.pattern = line.pattern;
    component.onChangePattern();
    expect(component.pattern).toEqual(Pattern.DottedLine);
    expect(component.line.pattern).toEqual(Pattern.DottedLine);
  });

  it('#onChangeJoin should change the line\'s lineJoin attribute', () => {
    const line: LineTool = new LineTool(new Color(100, 100, 100, 0.5));
    line.lineJoin = LineJoin.Point;
    component.lineJoin = line.lineJoin;
    component.onChangeJoin();
    expect(component.lineJoin).toEqual(LineJoin.Point);
    expect(component.line.lineJoin).toEqual(LineJoin.Point);

    line.lineJoin = 999;
    component.lineJoin = line.lineJoin;
    component.onChangeJoin();
    expect(component.lineJoin).toEqual(LineJoin.Point);
    expect(component.line.lineJoin).toEqual(LineJoin.Point);
  });

  it('#onChangeCap should change the line\'s lineCap attribute', () => {
    const line: LineTool = new LineTool(new Color(100, 100, 100, 0.5));
    line.lineCap = LineCap.Butt;
    component.lineCap = line.lineCap;
    component.onChangeCap();
    expect(component.lineCap).toEqual(LineCap.Butt);
    expect(component.line.lineCap).toEqual(LineCap.Butt);

    line.lineCap = 999;
    component.lineCap = line.lineCap;
    component.onChangeCap();
    expect(component.lineCap).toEqual(LineCap.Butt);
    expect(component.line.lineCap).toEqual(LineCap.Butt);
  });

  it('#onChangeCircleRadius should change the line\'s width attribute', () => {
    component.circleRadius = 20;
    component.onChangeCircleRadius();
    expect(component.circleRadius).toEqual(20);
    expect(component.line.circleRadius).toEqual(20);

    component.circleRadius = -1;
    component.onChangeCircleRadius();
    expect(component.circleRadius).toEqual(MIN_STROKE_WIDTH);
    expect(component.line.circleRadius).toEqual(MIN_STROKE_WIDTH);

    component.circleRadius = 500;
    component.onChangeCircleRadius();
    expect(component.circleRadius).toEqual(MAX_STROKE_WIDTH);
    expect(component.line.circleRadius).toEqual(MAX_STROKE_WIDTH);
  });

  it('rounding is properly updated', () => {
    component.lineRounding = 20;
    component.onChangeRounding();
    expect(component.lineRounding).toBe(20);
    expect(component.line.lineRounding).toBe(20);

    component.lineRounding = 500;
    component.onChangeRounding();
    expect(component.lineRounding).toBe(MAX_LINE_ROUNDING);
    expect(component.line.lineRounding).toBe(MAX_LINE_ROUNDING);

    component.lineRounding = -1;
    component.onChangeRounding();
    expect(component.lineRounding).toBe(DEFAULT_LINE_ROUNDING);
    expect(component.line.lineRounding).toBe(DEFAULT_LINE_ROUNDING);
  });
});
