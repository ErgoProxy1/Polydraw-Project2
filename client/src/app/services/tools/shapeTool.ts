import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, StrokeType } from '../utils/constantsAndEnums';

export abstract class ShapeTool {
  protected fillColor: Color;
  protected strokeColor: Color;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
  strokeType: StrokeType = StrokeType.FullWithOutline;
  protected perimeter: Rectangle;
  protected readonly PERIMETER_FILL_COLOR = new Color(0, 0, 0, 0.25);
  protected readonly PERIMETER_STROKE_COLOR = new Color(0, 0, 0, 0.5);

  constructor(fillColor: Color, strokeColor: Color) {
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }
}
