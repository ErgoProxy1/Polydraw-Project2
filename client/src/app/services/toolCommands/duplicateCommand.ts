import { ClipboardService } from '../clipboard/clipboard.service';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from './toolCommand';

export class DuplicateCommand implements ToolCommand {
  svgMap: Map<number, SVGPrimitive> = new Map<number, SVGPrimitive>();

  constructor(private primitiveSelected: SVGPrimitive[], private clipboardService: ClipboardService) {

  }

  apply(primitives: SVGPrimitive[]): void {
    this.clipboardService.incrementDuplicateOffset(this.primitiveSelected);
    this.primitiveSelected.forEach((primitive) => {
      const newPrimitive: SVGPrimitive = primitive.copy();
      newPrimitive.move(primitive.getTranslation().addPoint(this.clipboardService.getDuplicateOffset()));
      primitives.push(newPrimitive);
      this.svgMap.set(primitives.length - 1, newPrimitive);
    });
  }
  cancel(primitives: SVGPrimitive[]): void {
    this.clipboardService.decrementDuplicateOffset();
    let i = 0;
    this.svgMap.forEach((primitive: SVGPrimitive, key: number, map: Map<number, SVGPrimitive>) => {
      primitives.splice(key - i, 1);
      i += 1;
    });
  }
}
