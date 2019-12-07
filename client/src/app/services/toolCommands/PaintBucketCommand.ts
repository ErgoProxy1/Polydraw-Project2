import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from './toolCommand';

export class PaintBucketCommand implements ToolCommand {
    shapeToDraw: SVGPrimitive;
    constructor(shapeToDraw: SVGPrimitive) {
        this.shapeToDraw = shapeToDraw;
    }

    apply(primitives: SVGPrimitive[]): void {
        primitives.push(this.shapeToDraw);
    }

    cancel(primitives: SVGPrimitive[]): void {
        primitives.pop();
    }
}
