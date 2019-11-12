import { Color } from '../../utils/color';
import { AlignInfo, FontInfo, PrimitiveType } from '../../utils/constantsAndEnums';
import { LineInfo } from '../../utils/lineInfo';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export class TextPrimitive extends SVGPrimitive {

    type = PrimitiveType.Text;
    selectable = true;
    selected = false;
    fontWeight: string;
    private bold: boolean;
    fontStyle: string;
    private italic: boolean;
    size = 16;
    textColor: Color;
    font: FontInfo;
    align: AlignInfo;
    position: Point;
    lines: LineInfo[] = [];

    static createCopy(primitive: SVGPrimitive): TextPrimitive {
        const text: TextPrimitive = primitive as TextPrimitive;
        const newText: TextPrimitive = new TextPrimitive(
            text.size, text.textColor, text.font, text.align, text.position, text.bold, text.italic,
        );
        newText.topLeftCorner = text.topLeftCorner;
        newText.bottomRightCorner = text.bottomRightCorner;
        newText.lines = text.lines;
        return newText;
    }

    constructor(size: number, textColor: Color, font: FontInfo, align: AlignInfo, position: Point, bold: boolean, italics: boolean) {
        super();
        this.bold = bold;
        bold ? (this.fontWeight = 'bold') : (this.fontWeight = 'normal');
        this.italic = italics;
        italics ? (this.fontStyle = 'italic') : (this.fontStyle = 'normal');
        this.size = size;
        this.textColor = Color.copyColor(textColor);
        this.font = font;
        this.align = align;
        this.position = position;
        this.lines.push({ innertext: '', position: this.position });
        this.strokeColor = new Color(0, 0, 0);
    }

    copy(): SVGPrimitive {
        return TextPrimitive.createCopy(this);
    }

    setCorners(topLeftCorner: Point, bottomRightCorner: Point): void {
        this.topLeftCorner = topLeftCorner;
        this.bottomRightCorner = bottomRightCorner;
        this.areCornersSet = false;
      }
}
