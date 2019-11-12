
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ColorApplicatorToolCommand } from './colorApplicatorCommand';

describe('ColorApplicatorToolCommand', () => {
  let colorApplicator: ColorApplicatorToolCommand;
  let primitive: Rectangle;
  const originalColor = new Color(100, 120, 0, 1);
  const newColor = new Color(200, 240, 190, 1);
  const isPrimary = true;

  beforeEach(() => {
    primitive = new Rectangle(originalColor, originalColor, 10, StrokeType.Full, new Point(0, 0), 100, 50);
    colorApplicator = new ColorApplicatorToolCommand( primitive, isPrimary, newColor );
  });

  it('#changeColor should change the primitive color', () => {
      colorApplicator.changeColor(newColor);
      expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
  });

  it('#apply should change the primitive color', () => {
    const primitives: SVGPrimitive[] = [primitive];
    colorApplicator.apply(primitives);
    expect(primitive.fillColor).toEqual(newColor);
  });

  it('#cancel should revert the primitive color to its original color', () => {
    const primitives: SVGPrimitive[] = [primitive];
    colorApplicator.apply(primitives);
    colorApplicator.cancel(primitives);
    expect(primitive.fillColor).toEqual(originalColor);
  });

});
