import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { PaintBrushCommand } from '../toolCommands/paintBrushCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { Texture, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';
import { Tool } from './tool';

export class PaintBrushTool extends DrawingTool implements Tool {
  type = ToolType.PaintBrushTool;
  texture: Texture = Texture.Basic;
  private command: PaintBrushCommand;
  private isCreatingPath = false;

  constructor(strokeColor: Color) {
    super(strokeColor);
  }

  begin(position: Point): SVGPrimitive[] {
    this.command = new PaintBrushCommand(this.strokeColor, this.strokeWidth, this.texture);
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
