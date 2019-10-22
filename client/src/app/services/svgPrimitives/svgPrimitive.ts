import { PrimitiveType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

export abstract class SVGPrimitive {
  readonly type: PrimitiveType;
  readonly selectable: boolean;
  selected: boolean;
  protected topLeftCorner: Point = new Point(0, 0);
  protected bottomRightCorner: Point = new Point(0, 0);
  areCornersSet = false;

  setCorners(topLeftCorner: Point, bottomRightCorner: Point): void {
    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;
    this.areCornersSet = true;
  }

  getTopLeftCorner(): Point {
    return this.topLeftCorner;
  }

  getBottomRightCorner(): Point {
    return this.bottomRightCorner;
  }
}
