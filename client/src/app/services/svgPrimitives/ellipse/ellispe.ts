import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Shape } from '../shape/shape';
import { SVGPrimitive } from '../svgPrimitive';

export class Ellipse extends Shape {
  radiusX: number;
  radiusY: number;
  type = PrimitiveType.Ellipse;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType,
              center: Point, radiusX: number = 0, radiusY: number = 0) {
    super(fillColor, strokeColor, strokeWidth, strokeType, center, 2 * radiusX, 2 * radiusY);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.center = center;
  }

  static createCopy(primitive: SVGPrimitive): Ellipse {
    const ellipse: Ellipse = primitive as Ellipse;
    const newCenter: Point = new Point(ellipse.center.x, ellipse.center.y);
    const newEllipse: Ellipse = new Ellipse(Color.copyColor(ellipse.fillColor),
      Color.copyColor(ellipse.strokeColor), ellipse.strokeWidth, ellipse.strokeType,
      newCenter, ellipse.radiusX, ellipse.radiusY);
    newEllipse.width = ellipse.width;
    newEllipse.height = ellipse.height;
    newEllipse.absoluteHeight = ellipse.absoluteHeight;
    newEllipse.absoluteWidth = ellipse.absoluteWidth;
    newEllipse.corner1 = ellipse.corner1;
    newEllipse.corner2 = ellipse.corner2;
    return newEllipse;
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    super.resize(corner1, corner2, isRegular);
    this.radiusX = this.getAbsoluteWidth() / 2.0;
    this.radiusY = this.getAbsoluteHeight() / 2.0;
    this.updateCorners();
  }

  getCenter(): Point {
    return this.center;
  }
}
