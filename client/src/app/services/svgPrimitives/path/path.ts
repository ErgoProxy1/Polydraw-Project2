import { Color } from '../../utils/color';
import { PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export class Path implements SVGPrimitive {
  strokeColor: Color;
  strokeWidth: number;
  texture: Texture;
  points: string;
  type = PrimitiveType.Path;

  constructor(strokeColor: Color, strokeWidth: number, texture: Texture = Texture.Basic) {
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.texture = texture;
    this.points = '';
  }

  addPoint(point: Point): void {
    if ((this.points.length === 0)) {
      this.points += (`M${+point.x} ${+point.y} L${+point.x} ${+point.y}`);
    } else {
      this.points += (` L${+point.x} ${+point.y}`);
    }
  }

}
