import { Polygon } from '../svgPrimitives/polygon/polygon';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeToolCommand } from './shapeToolCommand';

export class PolygonCommand extends ShapeToolCommand {

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType,
              center: Point, numberSides: number) {
      super();
      this.shape = new Polygon(fillColor, strokeColor, strokeWidth, strokeType, center, 0, numberSides);
     }
  apply(): SVGPrimitive | null {
    return this.shape;
  }

  cancel(): void {
    return;
  }
}
