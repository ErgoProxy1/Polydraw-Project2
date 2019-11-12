import { Polygon } from '../svgPrimitives/polygon/polygon';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { MIN_STROKE_WIDTH, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeToolCommand } from './shapeToolCommand';

describe('ShapeToolCommand', () => {
  let polygonCommand: ShapeToolCommand;
  const origin: Point = new Point(0, 0);

  beforeEach(() => {
    polygonCommand = new ShapeToolCommand(
        new Polygon(Color.BLACK, Color.WHITE, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin, 10, 10));
  });

  it('should be created', () => {
    expect(polygonCommand).toBeTruthy();
    expect(polygonCommand.shape).not.toBeNull();
  });

  it('#apply should add the current Shape to the list of primitives', () => {
    const primitives: SVGPrimitive[] = [];
    polygonCommand.apply(primitives);
    expect(primitives).toContain(polygonCommand.shape);
  });

  it('#cancel should remove the current Shape from the list of primitives', () => {
    const primitives: SVGPrimitive[] = [polygonCommand.shape];
    polygonCommand.cancel(primitives);
    expect(primitives).not.toContain(polygonCommand.shape);
  });
});
