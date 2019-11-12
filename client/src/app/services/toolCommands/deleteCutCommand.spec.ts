import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Pen } from '../svgPrimitives/pen/pen';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, LineCap, LineJoin, Pattern, PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { StampInfo } from '../utils/stampData';
import { DeleteCutCommand } from './deleteCutCommand';

describe('DeleteCutCommand', () => {

  const primitives: SVGPrimitive[] = [
    new Polygon(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline, new Point(0, 0)),
    new Line(Color.BLACK, DEFAULT_STROKE_WIDTH, Pattern.SpacedLine1, LineJoin.Arcs, LineCap.Butt,
      1, 2),
    new Stamp(1, 45, new Point(0, 0), new StampInfo()),
    new Pen(Color.BLACK, DEFAULT_STROKE_WIDTH, PrimitiveType.Pen),
    new Ellipse(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
    new Point(0, 0)),
    new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
    new Point(0, 0)),
    new Path(Color.BLACK, DEFAULT_STROKE_WIDTH, PrimitiveType.Paint),
  ];
  const primitiveClipboard: SVGPrimitive[] = [primitives[0], primitives[4], primitives[6]];
  const command: DeleteCutCommand = new DeleteCutCommand(primitiveClipboard, primitives);
  it('should be created', () => {
    expect(command).toBeTruthy();
  });
  it('should remove the primitives in the clipboard from the primitives selected', () => {
    command.apply(primitives);
    primitives.forEach((primitive) => {
      expect(primitive).not.toContain(command.svgMap.get(0) as SVGPrimitive);
      expect(primitive).not.toContain(command.svgMap.get(4) as SVGPrimitive);
      expect(primitive).not.toContain(command.svgMap.get(6) as SVGPrimitive);
    });
  });
  it('should add the removed primitives from the clipboard to the array of primitives', () => {
    command.cancel(primitives);
    expect(primitives[0]).toEqual(primitiveClipboard[0]);
    expect(primitives[4]).toEqual(primitiveClipboard[1]);
    expect(primitives[6]).toEqual(primitiveClipboard[2]);
  });
});
