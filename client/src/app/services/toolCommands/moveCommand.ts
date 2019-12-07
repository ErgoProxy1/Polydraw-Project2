import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export class MoveCommand implements ToolCommand {
  private primitives: SVGPrimitive[];
  private translation: Point;

  constructor(primitives: SVGPrimitive[], translation: Point) {
    this.primitives = primitives;
    this.translation = translation;
  }

  apply(primitives: SVGPrimitive[]): void {
    this.primitives.forEach((primitive: SVGPrimitive) => {
      primitive.move(this.translation);
    });
  }

  cancel(primitives: SVGPrimitive[]): void {
    const reverseTranslation: Point = Point.copyPoint(this.translation);
    reverseTranslation.multiply(-1);
    this.primitives.forEach((primitive: SVGPrimitive) => {
      primitive.move(reverseTranslation);
    });
  }
}
