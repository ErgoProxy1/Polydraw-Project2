
import { Ellipse } from '../svgPrimitives/ellipse/ellipse';
import { Line } from '../svgPrimitives/line/line';
import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { Path } from '../svgPrimitives/path/path';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Quill } from '../svgPrimitives/quill/quill';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Spraypaint } from '../svgPrimitives/spraypaint/spraypaint';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
import { Color } from '../utils/color';
import { ALIGNS, FONTS, LineCap, LineJoin, Pattern, PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DEFAULT_STAMPS } from '../utils/stampData';
import { ColorApplicatorToolCommand } from './colorApplicatorCommand';

describe('ColorApplicatorToolCommand', () => {
  let colorApplicator: ColorApplicatorToolCommand;
  let primitive: Rectangle;
  const originalColor = new Color(100, 120, 0, 1);
  const newColor = new Color(200, 240, 190, 1);
  const isPrimary = true;

  beforeEach(() => {
    primitive = new Rectangle(originalColor, originalColor, 10, StrokeType.FullWithOutline, new Point(0, 0), 100, 50);
    colorApplicator = new ColorApplicatorToolCommand(primitive, isPrimary, newColor);
  });

  it('#changeColor should change the primitive color', () => {
    // Rectangle
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // ELlipse
    colorApplicator.primitive = new Ellipse(originalColor, originalColor, 3, StrokeType.FullWithOutline, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // ELlipse2
    colorApplicator.primitive = new Ellipse(originalColor, originalColor, 3, StrokeType.Outline, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Polygon
    colorApplicator.primitive = new Polygon(originalColor, originalColor, 3, StrokeType.FullWithOutline, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // pencil
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Pencil);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // paint
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Paint);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Quill
    colorApplicator.primitive = new Quill(originalColor);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Pen
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Pen);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Line
    colorApplicator.primitive = new Line(originalColor, 3, Pattern.DottedLine, LineJoin.Arcs, LineCap.Butt, 3, 3);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Fill
    colorApplicator.primitive = new FillingPath(originalColor, originalColor, 3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Text
    colorApplicator.primitive = new TextPrimitive(2, originalColor, FONTS[0], ALIGNS[0], new Point(2, 2), true, true);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Spray
    colorApplicator.primitive = new Spraypaint(originalColor, 3, 3);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Stamp
    colorApplicator.primitive = new Stamp(2, 2, new Point(0, 0), DEFAULT_STAMPS[1]);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);

    colorApplicator.isPrimary = false;
    // Rectangle
    colorApplicator.primitive = new Rectangle(originalColor, originalColor, 10, StrokeType.FullWithOutline, new Point(0, 0), 100, 50);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    colorApplicator.primitive = new Rectangle(originalColor, originalColor, 10, StrokeType.Full, new Point(0, 0), 100, 50);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // ELlipse
    colorApplicator.primitive = new Ellipse(originalColor, originalColor, 3, StrokeType.FullWithOutline, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // ELlipse 2
    colorApplicator.primitive = new Ellipse(originalColor, originalColor, 3, StrokeType.Full, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Polygon
    colorApplicator.primitive = new Polygon(originalColor, originalColor, 3, StrokeType.FullWithOutline, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Polygon
    colorApplicator.primitive = new Polygon(originalColor, originalColor, 3, StrokeType.Full, new Point(0, 0));
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // pencil
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Pencil);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // paint
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Paint);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Quill
    colorApplicator.primitive = new Quill(originalColor);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Pen
    colorApplicator.primitive = new Path(originalColor, 3, PrimitiveType.Pen);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Line
    colorApplicator.primitive = new Line(originalColor, 3, Pattern.DottedLine, LineJoin.Arcs, LineCap.Butt, 3, 3);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Fill
    colorApplicator.primitive = new FillingPath(originalColor, originalColor, 3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Fill
    colorApplicator.primitive = new FillingPath(originalColor, originalColor, 3, PrimitiveType.Fill, StrokeType.Full);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Text
    colorApplicator.primitive = new TextPrimitive(2, originalColor, FONTS[0], ALIGNS[0], new Point(2, 2), true, true);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Spray
    colorApplicator.primitive = new Spraypaint(originalColor, 3, 3);
    colorApplicator.changeColor(newColor);
    expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
    // Stamp
    colorApplicator.primitive = new Stamp(2, 2, new Point(0, 0), DEFAULT_STAMPS[1]);
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
