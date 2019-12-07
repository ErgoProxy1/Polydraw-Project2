import { ClipboardService } from '../clipboard/clipboard.service';
import { DrawingService } from '../drawing/drawing.service';
import { Ellipse } from '../svgPrimitives/ellipse/ellipse';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Pen } from '../svgPrimitives/pen/pen';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
// tslint:disable-next-line
import { DEFAULT_STROKE_WIDTH, LineCap, LineJoin, ORIGIN, PASTE_OFFSET, Pattern, PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { StampInfo } from '../utils/stampData';
import { DuplicateCommand } from './duplicateCommand';

describe('DuplicateCommandService', () => {
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
  const clipboardService: ClipboardService = new ClipboardService(new DrawingService());
  const primitiveClipboard: SVGPrimitive[] = [primitives[0], primitives[4], primitives[6]];
  let command: DuplicateCommand;

  beforeEach(() => {
    clipboardService.setPrimitives(primitiveClipboard);
    // tslint:disable-next-line: no-string-literal
    clipboardService['canvasHeight'] = 100;
    // tslint:disable-next-line: no-string-literal
    clipboardService['canvasWidth'] = 100;
    clipboardService.resetDuplicateOffset();
    command = new DuplicateCommand(primitiveClipboard, clipboardService);
  });

  it('should be properly created', () => {
    expect(command).toBeTruthy();
    expect(command.svgMap).not.toBeUndefined();
  });

  it('should add the offset primitives to the list of primitives' , () => {
    command.apply(primitives);
    expect(primitives).toContain(primitiveClipboard[0]);
    expect(primitives).toContain(primitiveClipboard[1]);
    expect(primitives).toContain(primitiveClipboard[2]);
  });

  it('should remove the primitives in the clipboard from the primitives selected', () => {
    command.cancel(primitives);
    primitives.forEach((primitive) => {
      expect(primitive).not.toContain(command.svgMap.get(0) as SVGPrimitive);
      expect(primitive).not.toContain(command.svgMap.get(4) as SVGPrimitive);
      expect(primitive).not.toContain(command.svgMap.get(6) as SVGPrimitive);
    });
  });

  it('should reset offset when the primitives pasted would be outside the canvas', () => {
    clipboardService.setPrimitives([new Rectangle(Color.BLACK, Color.WHITE, 2, StrokeType.FullWithOutline, ORIGIN, 10, 10)]);
    command = new DuplicateCommand(primitiveClipboard, clipboardService);
    command.apply(primitives);
    command = new DuplicateCommand(primitiveClipboard, clipboardService);
    command.apply(primitives);
    expect(clipboardService.getDuplicateOffset()).toEqual(ORIGIN);
  });

  it('should increment offset when the command is applied', () => {
    clipboardService.setPrimitives([new Rectangle(Color.BLACK, Color.WHITE, 2, StrokeType.FullWithOutline, ORIGIN, 10, 10)]);
    command = new DuplicateCommand(primitiveClipboard, clipboardService);
    command.apply(primitives);
    expect(clipboardService.getDuplicateOffset()).toEqual(Point.sumPoints(ORIGIN, PASTE_OFFSET));
  });

  it('should decrement offset when the command is cancelled', () => {
    clipboardService.setPrimitives([new Rectangle(Color.BLACK, Color.WHITE, 2, StrokeType.FullWithOutline, ORIGIN, 10, 10)]);
    command = new DuplicateCommand(primitiveClipboard, clipboardService);
    command.apply(primitives);
    const currentOffset: Point = Point.copyPoint(clipboardService.getDuplicateOffset());
    command.cancel(primitives);
    expect(clipboardService.getDuplicateOffset()).toEqual(Point.substractPoints(currentOffset, PASTE_OFFSET));
  });
});
