import { Color } from '../../utils/color';
import { PrimitiveType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { StampInfo } from '../../utils/stampData';
import { SVGPrimitive } from '../svgPrimitive';

export class Stamp extends SVGPrimitive {

  constructor(scale: number, angle: number, position: Point, info: StampInfo) {
    super();
    this.stampScale = info.adjustedScale * (scale / 100.0);
    this.angle = angle;
    this.position = position;
    this.info = info;
    this.createStampTransformationsStrings();
  }
  type = PrimitiveType.Stamp;
  selectable = true;
  selected = false;
  stampScale: number;
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
    const newStamp: Stamp = new Stamp(stamp.stampScale, stamp.angle, stamp.position, stamp.info );

    newStamp.stampScale = stamp.stampScale;
    newStamp.stampTransformations = stamp.stampTransformations;
    newStamp.stampRotation = stamp.stampRotation;
    newStamp.stampTranslation = stamp.stampTranslation;
    newStamp.scaled = stamp.scaled;
    newStamp.origin = stamp.origin;

    return newStamp;
  }

  createStampTransformationsStrings(): void {
    this.stampTranslation = 'translate(' +  this.position.x  + ',' + this.position.y + ') ';
    this.stampRotation = 'rotate(' + this.angle + ') ';
    this.scaled = 'scale(' + this.stampScale + ') ';
    this.stampTransformations = this.stampTranslation + this.stampRotation + this.scaled;
    this.origin = 0 + 'px ' + 0  + 'px';
    this.strokeColor = new Color(0, 0, 0);
  }

  copy(): SVGPrimitive {
    return Stamp.createCopy(this);
  }

}
