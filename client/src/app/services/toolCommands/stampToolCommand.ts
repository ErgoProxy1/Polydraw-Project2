import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { StampInfo } from '../utils/stampData';
import { ToolCommand } from './toolCommand';

export class StampToolCommand implements ToolCommand {
  stamp: Stamp;

  constructor(scale: number, angle: number, position: Point, info: StampInfo) {
    this.stamp = new Stamp(scale, angle, position, info);
  }

  rotate(rate: number): void {
    this.stamp.angle = this.stamp.angle + rate;
    this.stamp.createStampTransformationsStrings();
  }

  move(newPosition: Point): void {
    this.stamp.position = newPosition;
    this.stamp.createStampTransformationsStrings();
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.stamp);
  }

  cancel(primitives: SVGPrimitive[]): void {
    const index = primitives.indexOf(this.stamp, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
