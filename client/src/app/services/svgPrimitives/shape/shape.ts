import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export abstract class Shape extends SVGPrimitive {
  fillColor: Color;
  strokeColor: Color;
  strokeWidth: number;
  strokeType: StrokeType;
  protected width: number;
  protected height: number;
  protected absoluteWidth: number;
  protected absoluteHeight: number;
  center: Point;
  corner1: Point;
  corner2: Point;
  type = PrimitiveType.Abstract;
  selectable = true;
  selected = false;

  constructor(fillColor: Color, strokeColor: Color,
              strokeWidth: number,
              strokeType: StrokeType,
              center: Point,
              width: number,
              height: number) {
    super();
    this.fillColor = Color.copyColor(fillColor);
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.strokeType = strokeType;
    this.center = center;
    this.corner1 = center.addXY(-width / 2.0, -height / 2.0);
    this.corner2 = center.addXY(width / 2.0, height / 2.0);
    this.setWidth(width);
    this.setHeight(height);
    switch (strokeType) {
      case StrokeType.FullWithOutline: {
        break;
      }
      case StrokeType.Full: {
        this.strokeColor.a = 0;
        break;
      }
      case StrokeType.Outline: {
        this.fillColor.a = 0;
        break;
      }
    }
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    this.corner1 = corner1;
    this.corner2 = corner2;
    const width = corner2.x - corner1.x;
    const height = corner2.y - corner1.y;
    this.center = new Point((corner1.x + corner2.x) / 2.0, (corner1.y + corner2.y) / 2.0);
    this.setWidth(width);
    this.setHeight(height);
    if (isRegular) {
      this.absoluteWidth = this.absoluteHeight = Math.min(this.absoluteWidth, this.absoluteHeight);
      this.width = this.width < 0 ? -this.absoluteWidth : this.absoluteWidth;
      this.height = this.height < 0 ? -this.absoluteHeight : this.absoluteHeight;
      // On deplace le centre pour que la forme soit pres du coin1
      this.center.x -= (width - this.width) / 2.0;
      this.center.y -= (height - this.height) / 2.0;
    }
  }

  protected setWidth(width: number): void {
    this.width = width;
    this.absoluteWidth = Math.abs(width);
  }

  protected setHeight(height: number): void {
    this.height = height;
    this.absoluteHeight = Math.abs(height);
  }

  getAbsoluteWidth(): number {
    return this.absoluteWidth;
  }

  getAbsoluteHeight(): number {
    return this.absoluteHeight;
  }

  /**
   *  Met a jour les coins de la primitive directement pour eviter de passer par le calcul du boundingbox.
   */
  protected updateCorners() {
    let topLeft: Point = new Point(Math.min(this.corner1.x, this.corner1.x + this.width),
                                    Math.min(this.corner1.y, this.corner1.y + this.height));
    topLeft = this.strokeType === StrokeType.Full ? topLeft : topLeft.addXY(-this.strokeWidth / 2.0, -this.strokeWidth / 2.0);
    let bottomRight: Point = new Point(Math.max(this.corner1.x, this.corner1.x + this.width),
                                        Math.max(this.corner1.y, this.corner1.y + this.height));
    bottomRight = this.strokeType === StrokeType.Full ? bottomRight : bottomRight.addXY(this.strokeWidth / 2.0, this.strokeWidth / 2.0);
    this.setCorners(topLeft, bottomRight);
  }
}
