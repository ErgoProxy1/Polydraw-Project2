import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from './point';

export class GeometryHelper {

  static isPrimitiveIntersectingRectangle(primitive: SVGPrimitive, rectangle: Rectangle): boolean {
    const rectangleTopLeft: Point = rectangle.getTopLeftCorner();
    const rectangleBottomRight: Point = rectangle.getBottomRightCorner();
    const primitiveTopLeft: Point = primitive.getTopLeftCorner();
    const primitiveBottomRight: Point = primitive.getBottomRightCorner();

    const rectangleLeft: number = rectangleTopLeft.x;
    const rectangleTop: number = rectangleTopLeft.y;
    const rectangleRight: number = rectangleBottomRight.x;
    const rectangleBottom: number = rectangleBottomRight.y;

    const primitiveLeft: number = primitiveTopLeft.x;
    const primitiveTop: number = primitiveTopLeft.y;
    const primitiveRight: number = primitiveBottomRight.x;
    const primitiveBottom: number = primitiveBottomRight.y;

    return !(primitiveLeft > rectangleRight || primitiveTop > rectangleBottom
            || primitiveRight < rectangleLeft || primitiveBottom < rectangleTop);
  }

  static isPointInsideRectangle(point: Point, rectangle: Rectangle): boolean {
    const rectangleTopLeft: Point = rectangle.getTopLeftCorner();
    const rectangleBottomRight: Point = rectangle.getBottomRightCorner();
    return point.x > rectangleTopLeft.x && point.y > rectangleTopLeft.y
          && point.x < rectangleBottomRight.x && point.y < rectangleBottomRight.y;
  }
}
