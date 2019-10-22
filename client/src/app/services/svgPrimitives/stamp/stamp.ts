import { PrimitiveType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { StampInfo } from '../../utils/stampData';
import { SVGPrimitive } from '../svgPrimitive';

export class Stamp extends SVGPrimitive {
  type = PrimitiveType.Stamp;
  selectable = true;
  selected = false;
  scale: number;
  angle: number;
  position: Point;
  info: StampInfo;

  transformations: string;
  rotation: string;
  translation: string;
  scaled: string;
  origin: string;

  constructor(scale: number, angle: number, position: Point, info: StampInfo) {
    super();
    this.scale = info.adjustedScale * (scale / 100.0);
    this.angle = angle;
    this.position = position;
    this.info = info;

    this.translation = 'translate(' + position.x + ',' + position.y + ') ';
    this.rotation = 'rotate(' + angle + ') ';
    this.scaled = 'scale(' + this.scale + ') ';
    this.transformations = this.translation + this.rotation + this.scaled;
    this.origin = 0 + 'px ' + 0  + 'px';
  }

  static createCopy(primitive: SVGPrimitive): Stamp {
    const stamp: Stamp = primitive as Stamp;
    const newStamp: Stamp = new Stamp(stamp.scale, stamp.angle, stamp.position, stamp.info );

    newStamp.scale = stamp.scale;

    newStamp.transformations = stamp.transformations;
    newStamp.rotation = stamp.rotation;
    newStamp.translation = stamp.translation;
    newStamp.scaled = stamp.scaled;
    newStamp.origin = stamp.origin;
    return newStamp;
  }
}
