import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from './toolCommand';

export class EraserCommand implements ToolCommand {
  primitivesToErase: Map<number, SVGPrimitive>;
  constructor() {
    this.primitivesToErase = new Map<number, SVGPrimitive>();
  }

  apply(primitives: SVGPrimitive[]): void {
    this.primitivesToErase.forEach((primitive: SVGPrimitive) => {
      const index = primitives.indexOf(primitive);
      primitive.toShow = false;
      primitives.splice(index, 1);
    });
    this.sortMap();
  }

  cancel(primitives: SVGPrimitive[]): void {
    this.primitivesToErase.forEach((primitive: SVGPrimitive, index: number) => {
      primitive.toShow = true;
      primitives.splice(index, 0, primitive);
    });
  }

  removePrimitive(index: number, primitive: SVGPrimitive): void {
    primitive.toShow = false;
    this.primitivesToErase.set(index, primitive);
  }

  private sortMap(): void {
    this.primitivesToErase = new Map<number, SVGPrimitive>([...this.primitivesToErase].sort((primitiveA, primitiveB) => {
      return primitiveA[0] - primitiveB[0];
    }));
  }
}
