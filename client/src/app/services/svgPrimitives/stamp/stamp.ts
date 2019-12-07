import { Color } from '../../utils/color';
import { PrimitiveType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { StampInfo } from '../../utils/stampData';
import { SVGPrimitive } from '../svgPrimitive';

export class Stamp extends SVGPrimitive {

  constructor(scale: number, angle: number, position: Point, info: StampInfo) {
    super();
    this.stampScaleX = this.stampScaleY = info.adjustedScale * (scale / 100.0);
    this.angle = angle;
    this.position = position;
    this.info = info;
    this.createStampTransformationsStrings();
  }
  type = PrimitiveType.Stamp;
  SELECTABLE = true;
  selected = false;
  stampScaleX: number;
  stampScaleY: number;
  angle: number;
  position: Point;
  info: StampInfo;

  stampTransformations: string;
  stampRotation: string;
  stampTranslation: string;
  scaled: string;
  origin: string;

  static createCopy(primitive: SVGPrimitive): Stamp {
    const stamp: Stamp = primitive as Stamp;
    const newStamp: Stamp = new Stamp(stamp.stampScaleX, stamp.angle, Point.copyPoint(stamp.position), stamp.info );

    newStamp.stampScaleX = stamp.stampScaleX;
    newStamp.stampScaleY = stamp.stampScaleY;
    newStamp.stampTransformations = stamp.stampTransformations;
    newStamp.stampRotation = stamp.stampRotation;
    newStamp.stampTranslation = stamp.stampTranslation;
    newStamp.scaled = stamp.scaled;
    newStamp.origin = stamp.origin;

    newStamp.topLeftCorner = Point.copyPoint(stamp.topLeftCorner);
    newStamp.bottomRightCorner = Point.copyPoint(stamp.bottomRightCorner);

    newStamp.rotation = stamp.rotation;
    newStamp.scaleX = stamp.scaleX;
    newStamp.scaleY = stamp.scaleY;
    newStamp.transformations = stamp.transformations;

    return newStamp;
  }

  scale(translation: Point, scaleFactorX: number, scaleFactorY: number): void {
    this.stampScaleX *= scaleFactorX;
    this.stampScaleY *= scaleFactorY;
    this.move(translation);
    this.createStampTransformationsStrings();
  }

  createStampTransformationsStrings(): void {
    this.stampTranslation = `translate(${this.position.x},${this.position.y}) `;
    this.stampRotation = `rotate(${(-1) * this.angle},${this.stampScaleX * this.info.centerX},${this.stampScaleX * this.info.centerY}) `;
    this.scaled = `scale(${this.stampScaleX},${this.stampScaleY}) `;
    this.stampTransformations = `${this.stampTranslation}${this.stampRotation}${this.scaled}`;
    this.origin = `${0}px ${0 }px`;
    this.strokeColor = new Color(0, 0, 0);
  }

  copy(): Stamp {
    return Stamp.createCopy(this);
  }

  move(translation: Point): void {
    this.position.addPoint(translation);
    this.createStampTransformationsStrings();
    this.moveCorners(translation);
  }

}
