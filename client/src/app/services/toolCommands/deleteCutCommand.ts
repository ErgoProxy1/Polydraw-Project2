import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from './toolCommand';

export class DeleteCutCommand implements ToolCommand {
  svgMap: Map<number, SVGPrimitive> = new Map<number, SVGPrimitive>();

  constructor(svgClipboard: SVGPrimitive[], svgPrimitive: SVGPrimitive[]) {
    svgClipboard.forEach((primitive: SVGPrimitive) => {
      const index = svgPrimitive.indexOf(primitive, 0);
      if (index > -1) {
        this.svgMap.set(index, primitive);
      }
    });
  }

  apply(primitives: SVGPrimitive[]): void {
    let i = 0;
    this.svgMap.forEach((primitive: SVGPrimitive, key: number, map: Map<number, SVGPrimitive>) => {
      primitives.splice(key - i, 1);
      i += 1;
    });
  }

  cancel(primitives: SVGPrimitive[]): void {
    this.svgMap.forEach((primitive: SVGPrimitive, index: number) => {
      primitives.splice(index, 0, primitive);
    });
  }
}
