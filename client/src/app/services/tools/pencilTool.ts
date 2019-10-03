import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { PencilToolCommand } from '../toolCommands/pencilToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';
import { Tool } from './tool';

export class PencilTool extends DrawingTool implements Tool {
  type = ToolType.Pencil;
  private command: PencilToolCommand;
  private isCreatingPath = false;

  constructor(strokeColor: Color) {
    super(strokeColor);
  }

  begin(position: Point): SVGPrimitive[] {
    this.command = new PencilToolCommand(this.strokeColor, this.strokeWidth);
    this.command.path.addPoint(position);
    this.isCreatingPath = true;
    return [this.command.path];
  }

  update(position: Point): SVGPrimitive[] {
    if (this.isCreatingPath) {
      this.command.path.addPoint(position);
    }
    return this.isCreatingPath ?  [this.command.path] : [];
  }

  finish(position: Point): ToolCommand {
    if (this.isCreatingPath) {
      this.isCreatingPath = false;
    }
    return this.command;
  }

  keyDown(key: string): SVGPrimitive[] {
    return [];
  }

  keyUp(key: string): SVGPrimitive[] {
    return [];
  }
}
