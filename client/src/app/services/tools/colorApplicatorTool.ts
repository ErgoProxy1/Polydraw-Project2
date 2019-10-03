import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class ColorApplicatorTool implements Tool {
  type = ToolType.ColorApplicator;
  private command: ColorApplicatorToolCommand;
  private primaryColor: Color;
  private secondaryColor: Color;

  constructor(primaryColor: Color, secondaryColor: Color) {
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
  }

  begin(position: Point): SVGPrimitive[] {
    return [];
  }

  update(position: Point): SVGPrimitive[] {
    return [];
  }

  finish(position: Point, isLeft: boolean, primitive: SVGPrimitive): ToolCommand {
    const color: Color = isLeft ? Color.copyColor(this.primaryColor) : Color.copyColor(this.secondaryColor);
    this.command = new ColorApplicatorToolCommand(primitive, isLeft, color);
    this.command.apply();
    return this.command;
  }

  keyDown(key: string): SVGPrimitive[] {
    return [];
  }

  keyUp(key: string): SVGPrimitive[] {
    return [];
  }
}
