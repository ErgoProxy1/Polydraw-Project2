import { Path } from '../svgPrimitives/path/path';
import { Color } from '../utils/color';
import { PrimitiveType, Texture } from '../utils/constantsAndEnums';
import { DrawingToolCommand } from './drawingToolCommand';

export class PaintBrushCommand extends DrawingToolCommand {
  path: Path;
  constructor(strokeColor: Color, strokeWidth: number, texture: Texture) {
    super(strokeColor, strokeWidth, PrimitiveType.Paint, texture);
  }
}
