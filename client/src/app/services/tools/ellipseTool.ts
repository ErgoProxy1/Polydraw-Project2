import { Ellipse } from '../svgPrimitives/ellipse/ellipse';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeTool } from './shapeTool';

export class EllipseTool extends ShapeTool {
  TYPE = ToolType.EllipseTool;

  constructor(fillColor: Color, strokeColor: Color) {
    super(fillColor, strokeColor);
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    if (eventType === KeyboardEventType.ShiftDown || eventType === KeyboardEventType.ShiftUp) {
      if (eventType === KeyboardEventType.ShiftDown) {
        this.isRegular = true;
      } else if (eventType === KeyboardEventType.ShiftUp) {
        this.isRegular = false;
      }
      if (this.isCreatingShape) {
        this.command.resize(this.perimeter.corner1, this.perimeter.corner2, this.isRegular);
      }
      this.temporaryPrimitivesAvailable.next();
    }
  }

  protected begin(position: Point): void {
    this.command = new ShapeToolCommand(new Ellipse(this.fillColor, this.strokeColor, this.strokeWidth, this.strokeType, position));
    super.begin(position);
  }

  protected update(position: Point): void {
    if (this.isCreatingShape) {
      super.update(position);
    }
  }
}
