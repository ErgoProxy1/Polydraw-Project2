import { Color } from '../../utils/color';
import { PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Path } from '../path/path';
import { SVGPrimitive } from '../svgPrimitive';

export class Pen extends Path {
  headPoints: Point[] = [];
  paths: [[string, number]] = [['', 0]];

  constructor(strokeColor: Color, strokeWidth: number, type: PrimitiveType, texture: Texture = Texture.Basic) {
    super(strokeColor, strokeWidth, type, texture);
  }

  static createCopy(primitive: SVGPrimitive): Pen {
    const pen: Pen = primitive as Pen;
    const newPen: Pen = new Pen(Color.copyColor(pen.strokeColor), pen.strokeWidth, pen.type, pen.texture);

    newPen.paths = pen.paths;
    newPen.headPoints = pen.headPoints;
    newPen.commandSvg = pen.commandSvg;
    newPen.topLeftCorner = pen.topLeftCorner;
    newPen.bottomRightCorner = pen.bottomRightCorner;
    newPen.points = pen.points;

    return newPen;
  }

  protected buildPath(currentPoints: Point[]): string {
    let path = '';
    if (this.headPoints.length > 0) {
      path = `M${currentPoints[0].x} ${currentPoints[0].y}`;
      this.headPoints.forEach( (point) => { path += ` L${point.x} ${point.y}`; });
  }
    return path;
  }

  addPath( point: Point, strokeWidth: number): void {
    this.points.push(point);
    if (this.headPoints.length > 0) {
      this.headPoints = this.headPoints.slice(this.headPoints.length - 1);
    }
    this.headPoints.push(point);
    this.paths.push([this.buildPath(this.headPoints), strokeWidth]);
  }

  copy(): SVGPrimitive {
    return Pen.createCopy(this);
  }
}
