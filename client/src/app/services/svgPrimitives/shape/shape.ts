import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export abstract class Shape implements SVGPrimitive {
  fillColor: Color;
  strokeColor: Color;
  strokeWidth: number;
  strokeType: StrokeType;
  private width: number;
  private height: number;
  private absoluteWidth: number;
  private absoluteHeight: number;
  type = PrimitiveType.Abstract;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType, width: number, height: number) {
    this.fillColor = Color.copyColor(fillColor);
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.strokeType = strokeType;
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
    this.setWidth(corner2.x - corner1.x);
    this.setHeight(corner2.y - corner1.y);
    if (isRegular) {
      this.absoluteWidth = this.absoluteHeight = Math.min(this.absoluteWidth, this.absoluteHeight);
      this.width = this.width < 0 ? -this.absoluteWidth : this.absoluteWidth;
      this.height = this.height < 0 ? -this.absoluteHeight : this.absoluteHeight;
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

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getAbsoluteWidth(): number {
    return this.absoluteWidth;
  }

  getAbsoluteHeight(): number {
    return this.absoluteHeight;
  }
}
