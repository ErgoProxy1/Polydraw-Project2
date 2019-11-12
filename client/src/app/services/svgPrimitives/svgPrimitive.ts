import { Color } from '../utils/color';
import { ORIGIN, PrimitiveType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

export abstract class SVGPrimitive {
  readonly type: PrimitiveType;
  selected = false;
  readonly selectable: boolean;
  protected topLeftCorner: Point = new Point(0, 0);
  protected bottomRightCorner: Point = new Point(0, 0);
  areCornersSet = false;
  toShow = true;
  fillColor: Color;
  strokeColor: Color;

  protected transformations: string;
  protected translation: Point = Point.copyPoint(ORIGIN);
  protected rotation = 0;
  protected scale = 1;

  constructor() {
    this.createTransformationsStrings();
  }

  setCorners(topLeftCorner: Point, bottomRightCorner: Point): void {
    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;
    this.areCornersSet = true;
  }

  getTopLeftCorner(): Point {
    const topLeftCorner: Point = new Point(this.topLeftCorner.x, this.topLeftCorner.y);
    return topLeftCorner;
  }

  getBottomRightCorner(): Point {
    const bottomRightCorner: Point = new Point(this.bottomRightCorner.x, this.bottomRightCorner.y);
    return bottomRightCorner;
  }

  move(vector: Point): void {
    this.areCornersSet = false;
    this.translation = Point.copyPoint(vector);
    this.createTransformationsStrings();
  }

  abstract copy(): SVGPrimitive;

  protected createTransformationsStrings(): void {
    const translationString = 'translate(' + this.translation.x + ',' + this.translation.y + ') ';
    const rotationString = 'rotate(' + this.rotation + ') ';
    const scaleString = 'scale(' + this.scale + ') ';
    this.transformations = translationString + rotationString + scaleString;
  }

  getTranslation(): Point {
    return this.translation;
  }
}
