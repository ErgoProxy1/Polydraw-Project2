import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, Texture } from '../utils/constantsAndEnums';

export abstract class DrawingTool {
  protected strokeColor: Color;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
  texture: Texture = Texture.Basic;

  constructor(strokeColor: Color) {
    this.strokeColor = strokeColor;
  }
}
