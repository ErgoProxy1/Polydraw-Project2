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
    expect(LineToolCmd.path).toBeUndefined();
  });

  it('#apply should return the current line', () => {
      const line: SVGPrimitive | null = LineToolCmd.apply();
      expect(line).not.toBeNull();
      expect(line).toEqual(LineToolCmd.line);
    });

});
