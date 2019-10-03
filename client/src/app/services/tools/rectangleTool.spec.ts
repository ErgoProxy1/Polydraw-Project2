import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { RectangleCommand } from '../toolCommands/rectangleCommand';
import { Color } from '../utils/color';
import { SHIFT_KEY_CODE, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {RectangleTool} from './rectangleTool';

describe('RectangleTool', () => {
    let tool: RectangleTool;

    beforeEach(() => {
        tool = new RectangleTool(new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5));
      });

    it('Beginning is correctly identified', () => {
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, new Point(50, 50), 0, 0,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, new Point(50, 50),
        );
        expect(tool.begin(new Point(50, 50))).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('Size is correctly updated when #update is called', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 100);
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, point1, 50, 50,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.begin(point1);
        expect(tool.update(point2)).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('#update should return an empty list if #begin has not been called before', () => {
        const point: Point = new Point(50, 50);
        expect(tool.update(point)).toEqual([]);
    });

    it('Size is correctly updated when #keyDown is called', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, point1, 50, 150,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, true);
        tool.begin(point1);
        tool.update(point2);
        expect(tool.keyDown(SHIFT_KEY_CODE)).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('Size is not changed when #keyDown is called with a wrong parameter', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, point1, 50, 150,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.begin(point1);
        tool.update(point2);
        expect(tool.keyDown('aaaa')).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('#keydown should return an empty list if #begin has not been called before', () => {
        expect(tool.keyDown('')).toEqual([]);
    });

    it('Size is correctly updated when #keyUp is called', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, point1, 50, 150,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, false);
        tool.begin(point1);
        tool.update(point2);
        tool.keyDown(SHIFT_KEY_CODE);
        expect(tool.keyUp(SHIFT_KEY_CODE)).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('Size is not changed when #keyUp is called with a wrong parameter', () => {
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(100, 200);
        const expectedPerimeter: Rectangle = new Rectangle(
            new Color(0, 0, 0, 0), new Color(0, 0, 0, 0.5), 5, StrokeType.Outline, point1, 50, 150,
        );
        const expectedCommand: RectangleCommand = new RectangleCommand(
            new Color(128, 64, 32, 0.5), new Color(32, 64, 128, 0.5), 5, StrokeType.FullWithOutline, point1,
        );
        expectedCommand.resize(point1, point2, true);
        tool.begin(point1);
        tool.update(point2);
        tool.keyDown(SHIFT_KEY_CODE);
        expect(tool.keyUp('aaaa')).toEqual([
            expectedPerimeter,
            expectedCommand.shape,
        ]);
    });

    it('#keyup should return an empty list if #begin has not been called before', () => {
        expect(tool.keyUp('')).toEqual([]);
    });
});
