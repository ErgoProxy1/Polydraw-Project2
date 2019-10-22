import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Shape } from '../shape/shape';
import { SVGPrimitive } from '../svgPrimitive';

export class Rectangle extends Shape {
  position: Point; // coin superieur gauche du rectangle
  type = PrimitiveType.Rectangle;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType,
              position: Point, width: number = 0, height: number = 0) {
    super(fillColor, strokeColor, strokeWidth, strokeType, new Point(position.x + width / 2.0, position.y + height / 2.0), width, height);
    this.position = position;
  }

  static createCopy(primitive: SVGPrimitive): Rectangle {
    const rectangle: Rectangle = primitive as Rectangle;
    const newRectangle: Rectangle = new Rectangle(Color.copyColor(rectangle.fillColor), Color.copyColor(rectangle.strokeColor),
      rectangle.strokeWidth, rectangle.strokeType, rectangle.position, rectangle.width, rectangle.height);
    newRectangle.absoluteHeight = rectangle.absoluteHeight;
    newRectangle.absoluteWidth = rectangle.absoluteWidth;
    newRectangle.corner1 = rectangle.corner1;
    newRectangle.corner2 = rectangle.corner2;
    newRectangle.center = rectangle.center;
    return newRectangle;
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    super.resize(corner1, corner2, isRegular);
    this.position = this.center.addXY(-this.getAbsoluteWidth() / 2.0, -this.getAbsoluteHeight() / 2.0);
    this.updateCorners();
  }
}
