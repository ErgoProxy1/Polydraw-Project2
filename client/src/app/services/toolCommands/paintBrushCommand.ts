import { Path } from '../svgPrimitives/path/path';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { Texture } from '../utils/constantsAndEnums';
import { DrawingToolCommand } from './drawingToolCommand';

export class PaintBrushCommand extends DrawingToolCommand {
  path: Path;
  constructor(strokeColor: Color, strokeWidth: number, texture: Texture) {
    super(strokeColor, strokeWidth);
    this.path = new Path(strokeColor, strokeWidth, texture);
  }

  apply(): SVGPrimitive | null {
    return this.path;
  }
  cancel(): void {
    return;
  }
}
