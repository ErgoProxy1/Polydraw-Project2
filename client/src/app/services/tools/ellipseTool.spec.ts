import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { EllipseTool } from './ellipseTool';

describe('EllipseTool', () => {
  let tool: EllipseTool;

  beforeEach(() => {
      tool = new EllipseTool(new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5));
    });

  it('Beginning is correctly identified', () => {
    const expectedPerimeter: Perimeter = new Perimeter(new Point(50, 50));
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, new Point(50, 50),
    ));
    tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('Size is correctly updated when a mouse move occurs', () => {
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(100, 100);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
    ));
    expectedCommand.resize(point1, point2, false);
    tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
    tool.mouseEvent(MouseEventType.MouseMove, point2);
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('#update should return an empty list if #begin has not been called before', () => {
    const point: Point = new Point(50, 50);
    tool.mouseEvent(MouseEventType.MouseMove, point);
    expect(tool.getTemporaryPrimitives()).toEqual([]);
  });

  it('Size is correctly updated when a keyDown occurs', () => {
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(100, 200);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
    ));
    expectedCommand.resize(point1, point2, true);
    tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
    tool.mouseEvent(MouseEventType.MouseMove, point2);
    tool.keyboardEvent(KeyboardEventType.ShiftDown);
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('Size is not changed when a keyDown occurs with a wrong parameter', () => {
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(100, 200);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
    ));
    expectedCommand.resize(point1, point2, false);
    tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
    tool.mouseEvent(MouseEventType.MouseMove, point2);
    tool.keyboardEvent(KeyboardEventType.InvalidEvent);
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('#keyboardEvent should return an empty list if #begin has not been called before whether it is a keyUp or a keyDown', () => {
    tool.keyboardEvent(KeyboardEventType.ShiftDown);
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.keyboardEvent(KeyboardEventType.ShiftUp);
    expect(tool.getTemporaryPrimitives()).toEqual([]);
  });

  it('Size is correctly updated when a keyUp occurs', () => {
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(100, 200);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
    ));
    expectedCommand.resize(point1, point2, false);
    tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
    tool.mouseEvent(MouseEventType.MouseMove, point2);
    tool.keyboardEvent(KeyboardEventType.ShiftDown);
    tool.keyboardEvent(KeyboardEventType.ShiftUp);
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('Size is not changed when a keyUp occurs with a wrong parameter', () => {
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(100, 200);
    const expectedPerimeter: Perimeter = new Perimeter(point1);
    expectedPerimeter.resize(point1, point2);
    const expectedCommand: ShapeToolCommand = new ShapeToolCommand(new Ellipse(
      new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
    ));
    expectedCommand.resize(point1, point2, true);
    tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
    tool.mouseEvent(MouseEventType.MouseMove, point2);
    tool.keyboardEvent(KeyboardEventType.ShiftDown);
    tool.keyboardEvent(KeyboardEventType.InvalidEvent);
    expect(tool.getTemporaryPrimitives()).toEqual([
      expectedCommand.shape,
      expectedPerimeter,
    ]);
  });

  it('Other functions return empty arrays', () => {
    tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0));
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.mouseEvent(MouseEventType.MouseClickRight, new Point(0, 0));
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0));
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.mouseEvent(MouseEventType.MouseDownRight, new Point(0, 0));
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0));
    expect(tool.getTemporaryPrimitives()).toEqual([]);
    tool.mouseWheelEvent(0);
    expect(tool.getTemporaryPrimitives()).toEqual([]);
  });
});
