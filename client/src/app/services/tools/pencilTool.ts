import { Path } from '../svgPrimitives/path/path';
import { PencilToolCommand } from '../toolCommands/pencilToolCommand';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';
import { Tool } from './tool';

export class PencilTool extends DrawingTool implements Tool {
  type = ToolType.Pencil;
  path: Path;

  constructor(strokeColor: Color) {
    super(strokeColor);
  }

  protected begin(position: Point): void {
    this.command = new PencilToolCommand(this.strokeColor, this.strokeWidth);
    super.begin(position);
  }
}
