import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeToolCommand } from './shapeToolCommand';

export class RectangleCommand extends ShapeToolCommand {

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType, position: Point) {
    super();
    this.shape = new Rectangle(fillColor, strokeColor, strokeWidth, strokeType, position, 0, 0);
  }

  apply(): SVGPrimitive | null {
    return this.shape;
  }

  cancel(): void {
    return;
  }
}
