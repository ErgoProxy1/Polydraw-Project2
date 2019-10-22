import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { ToolCommand } from './toolCommand';

export class EyeDropperToolCommand implements ToolCommand {
    primitive: SVGPrimitive;
    isPrimary: boolean;
    newColor: Color;

    constructor(primitive: SVGPrimitive, isPrimary: boolean, newColor: Color) {
        this.primitive = primitive;
        this.isPrimary = isPrimary;
        this.newColor = newColor;
    }

    apply(): null {
        return null;
    }

    cancel(): void {
        //
    }
}
