import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH, DEFAULT_PEN_STROKE_WIDTH, MAX_OF_MAX_PEN_STROKE_WIDTH, MAX_OF_MIN_PEN_STROKE_WIDTH, MAX_STROKE_WIDTH,
  MIN_OF_MAX_PEN_STROKE_WIDTH, MIN_OF_MIN_PEN_STROKE_WIDTH, MIN_STROKE_WIDTH } from 'src/app/services/utils/constantsAndEnums';
import { PenPropertiesComponent } from './pen-properties.component';

describe('PencilPropertiesComponent', () => {
  let component: PenPropertiesComponent;
  let fixture: ComponentFixture<PenPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenPropertiesComponent ],
      imports: [FormsModule, HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.strokeWidth).toBe(DEFAULT_PEN_STROKE_WIDTH);
    expect(component.minStrokeWidth).toBe(DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH);
    expect(component.MAX_SLIDER_MAX_STROKEWITH).toBe(MAX_OF_MAX_PEN_STROKE_WIDTH);
    expect(component.MAX_SLIDER_MIN_STROKEWITH).toBe(MIN_OF_MAX_PEN_STROKE_WIDTH);
    expect(component.MIN_SLIDER_MAX_STROKEWITH).toBe(MAX_OF_MIN_PEN_STROKE_WIDTH);
    expect(component.MIN_SLIDER_MIN_STROKEWITH).toBe(MIN_OF_MIN_PEN_STROKE_WIDTH);
  });

  const setInputValue = (selector: string, value: string) => {
    const input = fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should correctly update the tool\'s strokeWidth if input is a valid value', () => {
    setInputValue('#penMaxStrokewidthinput', String(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2)));
    expect(component.pen.strokeWidth).toEqual(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2));
  });

  it('should set the tool\'s strokeWidth to minimum value if input value is too low', () => {
    setInputValue('#penMaxStrokewidthinput', String(MIN_STROKE_WIDTH - MAX_STROKE_WIDTH));
    expect(component.pen.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('should set the tool\'s strokeWidth to maximum value if input value is too high', () => {
    setInputValue('#penMaxStrokewidthinput', String(MAX_STROKE_WIDTH + MAX_STROKE_WIDTH));
    expect(component.pen.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });

});
