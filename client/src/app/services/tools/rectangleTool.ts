import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { RectangleCommand } from '../toolCommands/rectangleCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, SHIFT_KEY_CODE, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeTool } from './shapeTool';
import { Tool } from './tool';

export class RectangleTool extends ShapeTool implements Tool {
  type = ToolType.RectangleTool;
  private isShiftDown = false;

  constructor(fillColor: Color, strokeColor: Color) {
    super(fillColor, strokeColor);
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    if (key === SHIFT_KEY_CODE && (eventType === KeyboardEventType.KeyDown || eventType === KeyboardEventType.KeyUp)) {
      this.isShiftDown = eventType === KeyboardEventType.KeyDown;
      if (this.isCreatingShape) {
        this.command.resize(this.perimeter.corner1, this.perimeter.corner2, this.isShiftDown);
      }
    }
    return super.keyboardEvent(eventType, key);
  }

  protected begin(position: Point): void {
    this.command = new RectangleCommand(this.fillColor, this.strokeColor, this.strokeWidth, this.strokeType, position);
    super.begin(position);
  }

  protected update(position: Point): void {
    if (this.isCreatingShape) {
      super.update(position, this.isShiftDown);
    }
  }
}
