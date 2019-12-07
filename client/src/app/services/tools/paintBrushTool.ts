import { DrawingToolCommand } from '../toolCommands/drawingToolCommand';
import { Color } from '../utils/color';
import { PrimitiveType, Texture, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';

export class PaintBrushTool extends DrawingTool {
  TYPE = ToolType.PaintBrushTool;
  texture: Texture = Texture.Basic;

  constructor(strokeColor: Color) {
    super(strokeColor);
  }

  protected begin(position: Point): void {
    this.command = new DrawingToolCommand(this.strokeColor, this.strokeWidth, PrimitiveType.Paint, this.texture);
    super.begin(position);
  }
}
