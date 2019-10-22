import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class ColorApplicatorTool implements Tool {
  type = ToolType.ColorApplicator;
  private command: ColorApplicatorToolCommand;
  private primaryColor: Color;
  private secondaryColor: Color;
  private commandReady = false;

  constructor(primaryColor: Color, secondaryColor: Color) {
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
    if (primitive && (eventType === MouseEventType.MouseClickLeft || eventType === MouseEventType.MouseClickRight)) {
      this.createCommand(eventType === MouseEventType.MouseClickLeft, primitive);
    }
    return [];
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return [];
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return [];
  }

  isCommandReady(): boolean {
    return this.commandReady;
  }

  getCommand(): ToolCommand {
    this.commandReady = false;
    return this.command;
  }

  private createCommand(isLeft: boolean, primitive: SVGPrimitive): void {
    const color: Color = isLeft ? Color.copyColor(this.primaryColor) : Color.copyColor(this.secondaryColor);
    this.command = new ColorApplicatorToolCommand(primitive, isLeft, color);
    this.commandReady = true;
  }
}
