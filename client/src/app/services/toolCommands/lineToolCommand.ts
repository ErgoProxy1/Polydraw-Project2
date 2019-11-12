import { Line } from '../svgPrimitives/line/line';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { LineCap, LineJoin, Pattern } from '../utils/constantsAndEnums';
export class LineToolCommand {
  line: Line;

  constructor(strokeColor: Color, strokeWidth: number,
              pattern: Pattern,
              lineJoin: LineJoin,
              lineCap: LineCap,
              circleRadius: number,
              lineRounding: number) {
    this.line = new Line(strokeColor, strokeWidth, pattern, lineJoin, lineCap, circleRadius, lineRounding);
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.line);
  }

  cancel(primitives: SVGPrimitive[]): void {
    const index = primitives.indexOf(this.line, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
