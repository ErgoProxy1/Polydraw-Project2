import { Color } from '../../utils/color';
import { PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export class Path extends SVGPrimitive {
  strokeColor: Color;
  strokeWidth: number;
  texture: Texture;
  points: string;
  topLeftCorner: Point;
  bottomRightCorner: Point;
  type = PrimitiveType.Path;
  selectable = true;
  selected = false;

  constructor(strokeColor: Color, strokeWidth: number, texture: Texture = Texture.Basic) {
    super();
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.texture = texture;
    this.points = '';
  }

  static createCopy(primitive: SVGPrimitive): Path {
    const path: Path = primitive as Path;
    const newPath: Path = new Path(Color.copyColor(path.strokeColor), path.strokeWidth, path.texture);

    newPath.points = path.points;
    newPath.topLeftCorner = path.topLeftCorner;
    newPath.bottomRightCorner = path.bottomRightCorner;
    return newPath;
  }

  addPoint(point: Point): void {
    if ((this.points.length === 0)) {
      this.points += (`M${+point.x} ${+point.y} L${+point.x} ${+point.y}`);
    } else {
      this.points += (` L${+point.x} ${+point.y}`);
    }
  }
}
