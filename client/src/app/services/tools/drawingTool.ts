import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { DrawingToolCommand } from '../toolCommands/drawingToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, KeyboardEventType, MouseEventType, Texture, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export abstract class DrawingTool implements Tool {
  type = ToolType.None;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
 texture: Texture = Texture.Basic;
  protected strokeColor: Color;
  protected command: DrawingToolCommand;
  protected isCreatingPath = false;
  protected commandReady = false;

  constructor(strokeColor: Color) {
    this.strokeColor = strokeColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.begin(position);
        break;
      case MouseEventType.MouseMove:
        this.update(position);
        break;
      case MouseEventType.MouseUpLeft:
        this.update(position);
        this.finish();
        break;
    }
    return this.isCreatingPath ?  [this.command.path] : [];
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return this.isCreatingPath ?  [this.command.path] : [];
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return this.isCreatingPath ?  [this.command.path] : [];
  }

  isCommandReady(): boolean {
    return this.commandReady;
  }

  getCommand(): ToolCommand {
    this.commandReady = false;
    return this.command;
  }

  protected begin(position: Point): void {
    if (this.command) {
      this.command.path.addPoint(position);
      this.isCreatingPath = true;
      this.commandReady = false;
    }
  }

  protected update(position: Point): void {
    if (this.isCreatingPath && this.command) {
      this.command.path.addPoint(position);
    }
  }

  protected finish(): void {
    if (this.isCreatingPath) {
      this.isCreatingPath = false;
      this.commandReady = true;
    }
  }
}
