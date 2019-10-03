import { Path } from '../svgPrimitives/path/path';
import { Shape } from '../svgPrimitives/shape/shape';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { ToolCommand } from './toolCommand';

export class ColorApplicatorToolCommand implements ToolCommand {
    primitive: SVGPrimitive;
    lastColor: Color;
    newColor: Color;
    isPrimary: boolean;
    isApplicable: boolean; // If we can apply the command or not

    constructor(primitive: SVGPrimitive, isPrimary: boolean, color: Color) {
        this.primitive = primitive;
        this.isPrimary = isPrimary;
        this.newColor = Color.copyColor(color);
    }

    changeColor(color: Color): void {
        switch (this.primitive.type) {
            case PrimitiveType.Rectangle:
                const shape: Shape = (this.primitive as Shape);
                if (this.isPrimary && shape.strokeType !== StrokeType.Outline) {
                    this.lastColor = Color.copyColor(shape.fillColor);
                    shape.fillColor = Color.copyColor(color);
                } else if (!this.isPrimary && shape.strokeType !== StrokeType.Full) {
                    this.lastColor = Color.copyColor(shape.strokeColor);
                    shape.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Path:
                const path: Path = (this.primitive as Path);
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(path.strokeColor);
                    path.strokeColor = Color.copyColor(color);
                }
                break;
            default:
                break;
        }
    }

    apply(): null {
        this.changeColor(this.newColor);
        return null;
    }
    cancel(): void {
        return;
    }
}
