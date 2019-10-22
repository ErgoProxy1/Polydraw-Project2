import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { PolygonCommand } from '../toolCommands/polygonCommand';
import { Color } from '../utils/color';
import {  DEFAULT_STROKE_WIDTH, KeyboardEventType, MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { PolygonTool } from './polygonTool';

describe('PolygonToolService', () => {
   let polygone: PolygonTool;
   beforeEach(() => {
    polygone = new PolygonTool(new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5));
  });

   it('Beginning is correctly identified', () => {
    const expectedPerimeter: Perimeter = new Perimeter(new Point(0, 0));
    const expectedCommand: PolygonCommand = new PolygonCommand(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5),
      DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline, new Point(0, 0), 3);
    expect(polygone.mouseEvent(MouseEventType.MouseDownLeft, new Point(0, 0))).toEqual([expectedCommand.shape, expectedPerimeter]);
  });
   it('Size is correctly updated when a mouse move occurs', () => {
    const point1: Point = new Point(0, 0);
    const point2: Point = new Point(50, 50);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: PolygonCommand = new PolygonCommand(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5),
      DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline, point1, 3);
    expectedCommand.resize(point1, point2, false);
    polygone.mouseEvent(MouseEventType.MouseDownLeft, point1);
    expect(polygone.mouseEvent(MouseEventType.MouseMove, point2)).toEqual([expectedCommand.shape,
    expectedPerimeter]);
  });
   it('#update should return an empty list if #begin has not been called before', () => {
    const point: Point = new Point(0, 0);
    expect(polygone.mouseEvent(MouseEventType.MouseMove, point)).toEqual([]);
  });
   it('Other functions return empty arrays', () => {
    expect(polygone.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0))).toEqual([]);
    expect(polygone.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0))).toEqual([]);
    expect(polygone.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0))).toEqual([]);
    expect(polygone.mouseEvent(MouseEventType.MouseClickRight, new Point(0, 0))).toEqual([]);
    expect(polygone.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0))).toEqual([]);
    expect(polygone.mouseWheelEvent(0)).toEqual([]);
    expect(polygone.keyboardEvent(KeyboardEventType.KeyDown, 'aaaa')).toEqual([]);
  });

});
