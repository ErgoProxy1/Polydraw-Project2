import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, KeyboardEventType, MouseEventType, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export abstract class ShapeTool implements Tool {
  type = ToolType.None;
  protected fillColor: Color;
  protected strokeColor: Color;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
  strokeType: StrokeType = StrokeType.FullWithOutline;
  protected perimeter: Perimeter;
  protected command: ShapeToolCommand;
  protected isCreatingShape = false;
  protected commandReady = false;
  protected initialPosition: Point;

  constructor(fillColor: Color, strokeColor: Color) {
    this.fillColor = fillColor;
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
    return this.isCreatingShape ? [this.command.shape, this.perimeter] : [];
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return this.isCreatingShape ? [this.command.shape, this.perimeter] : [];
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return this.isCreatingShape ? [this.command.shape, this.perimeter] : [];
  }

  isCommandReady(): boolean {
    return this.commandReady;
  }

  getCommand(): ToolCommand {
    this.commandReady = false;
    return this.command;
  }

  protected begin(position: Point): void {
    this.initialPosition = position;
    this.perimeter = new Perimeter(position);
    this.isCreatingShape = true;
    this.commandReady = false;
  }

  protected update(position: Point, setRegular: boolean = false): void {
    if (this.isCreatingShape && this.command && this.perimeter) {
      this.perimeter.resize(this.initialPosition, position);
      this.command.resize(this.initialPosition, position, setRegular);
    }
  }

  protected finish(): void {
    if (this.isCreatingShape) {
      this.isCreatingShape = false;
      this.commandReady = true;
    }
  }
}
