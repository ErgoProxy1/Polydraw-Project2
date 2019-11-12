import { TestBed } from '@angular/core/testing';
import { Line } from '../svgPrimitives/line/line';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { CIRCLE_RADIUS_FACTOR, DEFAULT_LINE_ROUNDING, LineCap, LineJoin, MIN_STROKE_WIDTH, Pattern} from '../utils/constantsAndEnums';
import { LineToolCommand } from './lineToolCommand';

describe('LineToolCommand', () => {
  let LineToolCmd: LineToolCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    LineToolCmd = new LineToolCommand(Color.BLACK, MIN_STROKE_WIDTH, Pattern.FullLine, LineJoin.Round,
      LineCap.Round, CIRCLE_RADIUS_FACTOR * MIN_STROKE_WIDTH, DEFAULT_LINE_ROUNDING);
  });

  it('should be properly created', () => {
    expect(LineToolCmd).toBeTruthy();
    expect(LineToolCmd.line).toEqual(new Line(Color.BLACK, MIN_STROKE_WIDTH, Pattern.FullLine, LineJoin.Round,
        LineCap.Round, CIRCLE_RADIUS_FACTOR * MIN_STROKE_WIDTH, DEFAULT_LINE_ROUNDING));
  });

  it('#apply should add the current line to the list of primitives', () => {
    const primitives: SVGPrimitive[] = [];
    LineToolCmd.apply(primitives);
    expect(primitives).toContain(LineToolCmd.line);
  });

  it('#cancel should remove the current line from the list of primitives', () => {
    const primitives: SVGPrimitive[] = [LineToolCmd.line];
    LineToolCmd.cancel(primitives);
    expect(primitives).not.toContain(LineToolCmd.line);
  });

});
