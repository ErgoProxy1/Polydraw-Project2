import { Quill } from '../svgPrimitives/quill/quill';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { ToolCommand } from './toolCommand';

export class QuillToolCommand implements ToolCommand {

  quill: Quill;

  constructor(strokeColor: Color) {
    this.quill = new Quill(strokeColor);
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.quill);
  }

  cancel(primitives: SVGPrimitive[]) {
    const index = primitives.indexOf(this.quill, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
