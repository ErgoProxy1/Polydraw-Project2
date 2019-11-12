import { Shape } from '../svgPrimitives/shape/shape';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export class ShapeToolCommand implements ToolCommand {
  shape: Shape;

  constructor(shape: Shape) {
    this.shape = shape;
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    this.shape.resize(corner1, corner2, isRegular);
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.shape);
  }

  cancel(primitives: SVGPrimitive[]): void {
    const index = primitives.indexOf(this.shape, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
