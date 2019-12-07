import { Spraypaint } from '../svgPrimitives/spraypaint/spraypaint';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { ToolCommand } from './toolCommand';

export class SpraypaintToolCommand implements ToolCommand {

  spraypaint: Spraypaint;

  constructor(strokeColor: Color, paintDelay: number, range: number) {
    this.spraypaint = new Spraypaint(strokeColor, paintDelay, range);
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.spraypaint);
  }

  cancel(primitives: SVGPrimitive[]) {
    const index = primitives.indexOf(this.spraypaint, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
