import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { RectangleCommand } from '../toolCommands/rectangleCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, SHIFT_KEY_CODE, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { RectangleTool } from './rectangleTool';

describe('RectangleTool', () => {
    let tool: RectangleTool;

    beforeEach(() => {
        tool = new RectangleTool(new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5));
      });

    it('Beginning is correctly identified', () => {
        const expectedPerimeter: Perimeter = new Perimeter(new Point(50, 50));
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, new Point(50, 50),
        );
        expect(tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50))).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('Size is correctly updated when a mouse move occurs', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 100);
        const expectedPerimeter: Perimeter = new Perimeter(point1);
        expectedPerimeter.resize(point1, point2);
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
        expect(tool.mouseEvent(MouseEventType.MouseMove, point2)).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('#update should return an empty list if #begin has not been called before', () => {
        const point: Point = new Point(50, 50);
        expect(tool.mouseEvent(MouseEventType.MouseMove, point)).toEqual([]);
    });

    it('Size is correctly updated when a keyDown occurs', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Perimeter = new Perimeter(point1);
        expectedPerimeter.resize(point1, point2);
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, true);
        tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
        tool.mouseEvent(MouseEventType.MouseMove, point2);
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, SHIFT_KEY_CODE)).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('Size is not changed when a keyDown occurs with a wrong parameter', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Perimeter = new Perimeter(point1);
        expectedPerimeter.resize(point1, point2);
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
        tool.mouseEvent(MouseEventType.MouseMove, point2);
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, 'aaaa')).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('#keyboardEvent should return an empty list if #begin has not been called before whether it is a keyUp or a keyDown', () => {
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, SHIFT_KEY_CODE)).toEqual([]);
        expect(tool.keyboardEvent(KeyboardEventType.KeyUp, SHIFT_KEY_CODE)).toEqual([]);
    });

    it('Size is correctly updated when a keyUp occurs', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Perimeter = new Perimeter(point1);
        expectedPerimeter.resize(point1, point2);
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
        tool.mouseEvent(MouseEventType.MouseMove, point2);
        tool.keyboardEvent(KeyboardEventType.KeyDown, SHIFT_KEY_CODE);
        expect(tool.keyboardEvent(KeyboardEventType.KeyUp, SHIFT_KEY_CODE)).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('Size is not changed when a keyUp occurs with a wrong parameter', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Perimeter = new Perimeter(point1);
        expectedPerimeter.resize(point1, point2);
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, true);
        tool.mouseEvent(MouseEventType.MouseDownLeft, point1);
        tool.mouseEvent(MouseEventType.MouseMove, point2);
        tool.keyboardEvent(KeyboardEventType.KeyDown, SHIFT_KEY_CODE);
        expect(tool.keyboardEvent(KeyboardEventType.KeyUp, 'aaaa')).toEqual([
            expectedCommand.shape,
            expectedPerimeter,
        ]);
    });

    it('Other functions return empty arrays', () => {
        expect(tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseClickRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseDownRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0))).toEqual([]);
        expect(tool.mouseWheelEvent(0)).toEqual([]);
    });
});
