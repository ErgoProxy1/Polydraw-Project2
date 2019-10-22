import { PaintBrushCommand } from '../toolCommands/paintBrushCommand';
import { Color } from '../utils/color';
import { Texture, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';
import { Tool } from './tool';

export class PaintBrushTool extends DrawingTool implements Tool {
  type = ToolType.PaintBrushTool;
  texture: Texture = Texture.Basic;

  constructor(strokeColor: Color) {
    super(strokeColor);
  }

  protected begin(position: Point): void {
    this.command = new PaintBrushCommand(this.strokeColor, this.strokeWidth, this.texture);
    super.begin(position);
  }
}
