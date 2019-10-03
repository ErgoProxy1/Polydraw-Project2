import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { RectangleCommand } from '../toolCommands/rectangleCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { SHIFT_KEY_CODE, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeTool } from './shapeTool';
import { Tool } from './tool';

export class RectangleTool extends ShapeTool implements Tool {
  type = ToolType.RectangleTool;

  private command: RectangleCommand;
  private isShiftDown = false;
  private isCreatingRectangle = false;
  private initialPosition: Point;

  constructor(fillColor: Color, strokeColor: Color) {
    super(fillColor, strokeColor);
  }

  begin(position: Point): SVGPrimitive[] {
    this.initialPosition = position;
    this.command = new RectangleCommand(this.fillColor, this.strokeColor, this.strokeWidth, this.strokeType, position);
    this.perimeter = new Rectangle(this.PERIMETER_FILL_COLOR, this.PERIMETER_STROKE_COLOR, this.strokeWidth, StrokeType.Outline, position);
    this.isCreatingRectangle = true;
    return [this.perimeter, this.command.shape];
  }

  update(position: Point): SVGPrimitive[] {
    if (this.isCreatingRectangle) {
      this.perimeter.resize(this.initialPosition, position, false);
      this.command.resize(this.initialPosition, position, this.isShiftDown);
    }
    return this.isCreatingRectangle ? [this.perimeter, this.command.shape] : [];
  }

  finish(position: Point): ToolCommand {
    if (this.isCreatingRectangle) {
      this.isCreatingRectangle = false;
    }
    return this.command;
  }

  keyDown(key: string): SVGPrimitive[] {
    if (key === SHIFT_KEY_CODE) {
      this.isShiftDown = true;
      if (this.isCreatingRectangle) {
        this.command.resize(this.perimeter.corner1, this.perimeter.corner2, true);
      }
    }
    return this.isCreatingRectangle ? [this.perimeter, this.command.shape] : [];
  }

  keyUp(key: string): SVGPrimitive[] {
    if (key === SHIFT_KEY_CODE) {
      this.isShiftDown = false;
      if (this.isCreatingRectangle) {
        this.command.resize(this.perimeter.corner1, this.perimeter.corner2, false);
      }
    }
    return this.isCreatingRectangle ? [this.perimeter, this.command.shape] : [];
  }
}
