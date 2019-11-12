import { ClipboardService } from '../clipboard/clipboard.service';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from './toolCommand';

export class PasteCommand implements ToolCommand {
  svgClipboard: SVGPrimitive[] = [];
  svgMap: Map<number, SVGPrimitive> = new Map<number, SVGPrimitive>();

  constructor(private clipboardService: ClipboardService) {
    this.svgClipboard = clipboardService.primitives;
  }
  apply(primitives: SVGPrimitive[]): void {
    this.clipboardService.incrementPasteOffset();
    this.svgClipboard.forEach((primitive: SVGPrimitive) => {
      const newPrimitive: SVGPrimitive = primitive.copy();
      newPrimitive.move(primitive.getTranslation().addPoint(this.clipboardService.getPasteOffset()));
      primitives.push(newPrimitive);
      this.svgMap.set(primitives.length - 1, newPrimitive);
    });
  }

  cancel(primitives: SVGPrimitive[]): void {
    this.clipboardService.decrementPasteOffset();
    let i = 0;
    this.svgMap.forEach((primitive: SVGPrimitive, key: number, map: Map<number, SVGPrimitive>) => {
      primitives.splice(key - i, 1);
      i += 1;
    });
  }
}
