import { Color } from '../../utils/color';
import { PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export class Path extends SVGPrimitive {
  strokeWidth: number;
  texture: Texture;
  commandSvg: string;
  topLeftCorner: Point;
  bottomRightCorner: Point;
  type: PrimitiveType;
  selectable = true;
  selected = false;
  points: Point[] = [];

  constructor(strokeColor: Color, strokeWidth: number, type: PrimitiveType, texture: Texture = Texture.Basic) {
    super();
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.type = type;
    this.texture = texture;
    this.commandSvg = '';
  }

  static createCopy(primitive: SVGPrimitive): Path {
    const path: Path = primitive as Path;
    const newPath: Path = new Path(Color.copyColor(path.strokeColor), path.strokeWidth, path.type, path.texture);

    newPath.commandSvg = path.commandSvg;
    newPath.topLeftCorner = path.topLeftCorner;
    newPath.bottomRightCorner = path.bottomRightCorner;
    newPath.points = path.points;

    return newPath;
  }

  addPoint(point: Point): void {
    this.points.push(point);
    this.commandSvg += (this.commandSvg.length === 0) ?
                      (`M${+point.x} ${+point.y} L${+point.x} ${+point.y}`) : (` L${+point.x} ${+point.y}`);
  }

  copy(): SVGPrimitive {
    return Path.createCopy(this);
  }
}
