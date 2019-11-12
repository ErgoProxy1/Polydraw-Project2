import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Shape } from '../svgPrimitives/shape/shape';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
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
            case PrimitiveType.Ellipse:
                const shape: Shape = (this.primitive as Shape);
                if (this.isPrimary && shape.strokeType !== StrokeType.Outline) {
                    this.lastColor = Color.copyColor(shape.fillColor);
                    shape.fillColor = Color.copyColor(color);
                } else if (!this.isPrimary && shape.strokeType !== StrokeType.Full) {
                    this.lastColor = Color.copyColor(shape.strokeColor);
                    shape.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Polygon:
                const polygon: Shape = (this.primitive as Shape);
                if (this.isPrimary && polygon.strokeType !== StrokeType.Outline) {
                    this.lastColor = polygon.fillColor;
                    polygon.fillColor = color;
                } else if (!this.isPrimary && polygon.strokeType !== StrokeType.Full) {
                    this.lastColor = polygon.strokeColor;
                    polygon.strokeColor = color;
                }
                break;
            case PrimitiveType.Paint:
                const path: Path = (this.primitive as Path);
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(path.strokeColor);
                    path.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Pencil:
                const pencil: Path = (this.primitive as Path);
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(pencil.strokeColor);
                    pencil.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Line:
                const line: Line = (this.primitive as Line);
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(line.strokeColor);
                    line.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Pen:
                const pen: Path = (this.primitive as Path);
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(pen.strokeColor);
                    pen.strokeColor = Color.copyColor(color);
                }
                break;
            case PrimitiveType.Text:
                const text: TextPrimitive = this.primitive as TextPrimitive;
                if (this.isPrimary) {
                    this.lastColor = Color.copyColor(text.textColor);
                    text.textColor = Color.copyColor(color);
                }
                break;
            default:
                break;
        }
    }

    apply(primitives: SVGPrimitive[]): void {
        this.changeColor(this.newColor);
    }

    cancel(primitives: SVGPrimitive[]): void {
        this.changeColor(this.lastColor);
    }
}
