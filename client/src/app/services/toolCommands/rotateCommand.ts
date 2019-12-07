import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export class RotateCommand implements ToolCommand {
  centers: Point[] = [];
  constructor(private primitivesSelected: SVGPrimitive[], private angle: number, private aroundCenter: boolean) {}

  apply(primitives: SVGPrimitive[]): void {
    this.primitivesSelected.forEach((primitive: SVGPrimitive) => {
      primitive.rotate(this.angle, this.aroundCenter, true);
    });
  }

  cancel(primitives: SVGPrimitive[]): void {
    this.primitivesSelected.forEach((primitive: SVGPrimitive) => {
      primitive.rotate(-this.angle, this.aroundCenter, true);
    });
  }

  getCenter(): void {
    this.centers = [];
    this.primitivesSelected.forEach((primitive: SVGPrimitive) => {
      primitive.rotationCenterOrigin = Point.copyPoint(primitive.getCenter());
      this.centers.push(Point.copyPoint(primitive.rotationCenterOrigin));
    });
  }

  setLastCenters(): void {
    this.primitivesSelected.forEach((primitive: SVGPrimitive , index: number) => {
      primitive.rotationCenterOrigin = Point.copyPoint(this.centers[index]);
    });
  }
}
