import { Line } from '../svgPrimitives/line/line';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { LineCap, LineJoin, Pattern } from '../utils/constantsAndEnums';
import { DrawingToolCommand } from './drawingToolCommand';
export class LineToolCommand extends DrawingToolCommand {

  constructor(strokeColor: Color, strokeWidth: number,
              pattern: Pattern,
              lineJoin: LineJoin,
              lineCap: LineCap,
              circleRadius: number,
              lineRounding: number) {
    super(strokeColor, strokeWidth);
    this.line = new Line(strokeColor, strokeWidth, pattern, lineJoin, lineCap, circleRadius, lineRounding);
  }

  apply(): SVGPrimitive | null {
    return this.line;
  }
  cancel(): void {
    return;
  }
}
