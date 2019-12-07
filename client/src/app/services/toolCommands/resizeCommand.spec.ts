import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { MIN_STROKE_WIDTH, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ResizeCommand } from './resizeCommand';

describe('ResizeCommand', () => {
  let command: ResizeCommand;
  let translationMap = new Map<number, Point>();
  let reverseTranslationMap = new Map<number, Point>();
  const translation = new Point(1, 1);
  const reverseTranslation = new Point(-1, -1);
  let primitives: SVGPrimitive[] = [];
  let rectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, new Point(100, 100), 100, 50);

  beforeEach(() => {
    primitives = [];
    rectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, new Point(100, 100), 100, 50);
    primitives.push(rectangle);
    translationMap.set(0, translation);
    command = new ResizeCommand(primitives, translationMap, 2, 1);
  });

  it('is properly constructed', () => {
    translationMap = new Map<number, Point>();
    reverseTranslationMap = new Map<number, Point>();
    translationMap.set(0, translation);
    reverseTranslationMap.set(0, reverseTranslation);
    primitives = [];
    primitives.push(rectangle);
    expect(command).toBeTruthy();
    // tslint:disable-next-line: no-string-literal
    expect(command['primitives'].get(0)).toEqual(rectangle);
    // tslint:disable-next-line: no-string-literal
    expect(command['translations']).toEqual(translationMap);
    // tslint:disable-next-line: no-string-literal
    expect(command['reverseTranslations']).toEqual(reverseTranslationMap);
    // tslint:disable-next-line: no-string-literal
    expect(command['scaleFactorX']).toEqual(2);
    // tslint:disable-next-line: no-string-literal
    expect(command['scaleFactorY']).toEqual(1);
  });

  it('applies correctly', () => {
    const expectedRectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(100, 100), 100, 50);
    expectedRectangle.scale(translation, 2, 1);
    command.apply(primitives);
    // tslint:disable-next-line: no-string-literal
    expect(command['primitives'].get(0)).toEqual(expectedRectangle);
  });

  it('cancels correctly', () => {
    const expectedRectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(100, 100), 100, 50);
    command.apply(primitives);
    command.cancel(primitives);
    // tslint:disable-next-line: no-string-literal
    expect(command['primitives'].get(0)).toEqual(expectedRectangle);
  });
});
