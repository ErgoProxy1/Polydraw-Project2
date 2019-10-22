import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Color } from '../utils/color';
import { MIN_STROKE_WIDTH, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { PolygonCommand } from './polygonCommand';

describe('PolygonCommand', () => {
  let polygonCommand: PolygonCommand;
  const origin: Point = new Point(0, 0);
  beforeEach(() => { polygonCommand = new PolygonCommand(Color.BLACK, Color.WHITE, MIN_STROKE_WIDTH, StrokeType.FullWithOutline
    , origin, 6);
    });
  it('should be created', () => {
    expect(polygonCommand).toBeTruthy();
    expect(polygonCommand.shape).not.toBeNull();
  });
  it('apply should return the current Polygon', () => {
    expect(polygonCommand.apply()).toEqual(new Polygon(Color.BLACK, Color.WHITE, MIN_STROKE_WIDTH,
      StrokeType.FullWithOutline, origin, 0, 6));
  });
});
