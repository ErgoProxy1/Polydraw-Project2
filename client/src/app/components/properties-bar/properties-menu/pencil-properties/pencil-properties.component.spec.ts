import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH } from 'src/app/services/utils/constantsAndEnums';
import { PencilPropertiesComponent } from './pencil-properties.component';

describe('PencilPropertiesComponent', () => {
  let component: PencilPropertiesComponent;
  let fixture: ComponentFixture<PencilPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilPropertiesComponent ],
      imports: [FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const setInputValue = (selector: string, value: string) => {
    const input = fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should correctly update the tool\'s strokeWidth if input is a valid value', () => {
    setInputValue('#strokewidthinput', String(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2)));
    expect(component.pencil.strokeWidth).toEqual(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2));
  });

  it('should set the tool\'s strokeWidth to minimum value if input value is too low', () => {
    setInputValue('#strokewidthinput', String(MIN_STROKE_WIDTH - MAX_STROKE_WIDTH));
    expect(component.pencil.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('should set the tool\'s strokeWidth to maximum value if input value is too high', () => {
    setInputValue('#strokewidthinput', String(MAX_STROKE_WIDTH + MAX_STROKE_WIDTH));
    expect(component.pencil.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });

});
