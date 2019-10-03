import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { PaintBrushTool } from 'src/app/services/tools/paintBrushTool';
import { Color } from 'src/app/services/utils/color';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, Texture } from 'src/app/services/utils/constantsAndEnums';
import { PaintBrushPropertiesComponent } from './paint-brush-properties.component';

describe('PaintBrushPropertiesComponent', () => {
  let component: PaintBrushPropertiesComponent;
  let fixture: ComponentFixture<PaintBrushPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintBrushPropertiesComponent ],
      imports: [FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBrushPropertiesComponent);
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
    expect(component.paintBrush.strokeWidth).toEqual(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2));
  });

  it('should set the tool\'s strokeWidth to minimum value if input value is too low', () => {
    setInputValue('#strokewidthinput', String(MIN_STROKE_WIDTH - MAX_STROKE_WIDTH));
    expect(component.paintBrush.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  it('should set the tool\'s strokeWidth to maximum value if input value is too high', () => {
    setInputValue('#strokewidthinput', String(MAX_STROKE_WIDTH + MAX_STROKE_WIDTH));
    expect(component.paintBrush.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });

  it('should change the tool\'s texture with respect to the component\'s texture attribute', () => {
    const paintBrush: PaintBrushTool = new PaintBrushTool(new Color(128, 64, 32, 0.5));
    paintBrush.texture = Texture.Degraded;
    component.paintBrush = paintBrush;
    component.onChangeTexture();
    expect(component.paintBrush.texture).toEqual(Texture.Basic);
  });

});
