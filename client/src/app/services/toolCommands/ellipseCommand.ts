import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeToolCommand } from './shapeToolCommand';

export class EllipseCommand extends ShapeToolCommand {

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType, center: Point) {
    super();
    this.shape = new Ellipse(fillColor, strokeColor, strokeWidth, strokeType, center);
  }

  apply(): SVGPrimitive | null {
    return this.shape;
  }

  cancel(): void {
    return;
  }
}
