import { Path } from '../svgPrimitives/path/path';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { Texture } from '../utils/constantsAndEnums';
import { DrawingToolCommand } from './drawingToolCommand';

export class PencilToolCommand extends DrawingToolCommand {
  constructor(strokeColor: Color, strokeWidth: number) {
    super(strokeColor, strokeWidth);
    this.path = new Path(strokeColor, strokeWidth, Texture.Basic);
  }

  apply(): SVGPrimitive | null {
    return this.path;
  }
  cancel(): void {
    return;
  }
}
