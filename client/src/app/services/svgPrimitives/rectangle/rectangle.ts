import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Shape } from '../shape/shape';
import { SVGPrimitive } from '../svgPrimitive';

export class Rectangle extends Shape implements SVGPrimitive {
  position: Point; // coin superieur gauche du rectangle
  corner1: Point; // coin representant la position initiale du rectangle englobant
  corner2: Point; // coin oppose au coin1 sur le rectangle englobant
  type = PrimitiveType.Rectangle;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType,
              position: Point, width: number = 0, height: number = 0) {
    super(fillColor, strokeColor, strokeWidth, strokeType, width, height);
    this.corner1 = this.position = position;
    this.corner2 = new Point(position.x + width, position.y + height);
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    super.resize(corner1, corner2, isRegular);
    this.position = new Point(Math.min(corner1.x, corner2.x), Math.min(corner1.y, corner2.y));
    this.corner1 = corner1;
    this.corner2 = corner2;
    if (isRegular) { // Si il est regulier, deplacer la position au bon endroit pour que le carre reste relie au coin1
      const width = corner2.x - corner1.x;
      const height = corner2.y - corner1.y;
      if (width < 0 && Math.abs(width) > Math.abs(this.getWidth())) {
        this.position.x -= width - this.getWidth();
      }
      if (height < 0 && Math.abs(height) > Math.abs(this.getHeight())) {
        this.position.y -= height - this.getHeight();
      }
    }
  }
}
