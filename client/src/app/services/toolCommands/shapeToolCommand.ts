import { Shape } from '../svgPrimitives/shape/shape';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export abstract class ShapeToolCommand implements ToolCommand {
  shape: Shape;

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    this.shape.resize(corner1, corner2, isRegular);
  }

  abstract apply(): SVGPrimitive | null;
  abstract cancel(): void;
}
