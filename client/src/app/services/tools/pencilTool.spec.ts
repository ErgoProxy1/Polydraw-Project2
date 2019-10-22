import { Path } from '../svgPrimitives/path/path';
import { PencilToolCommand } from '../toolCommands/pencilToolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {PencilTool} from './pencilTool';

describe('PencilTool', () => {
    let tool: PencilTool = new PencilTool(new Color(128, 64, 32, 0.5));

    beforeEach(() => {
        tool = new PencilTool(new Color(128, 64, 32, 0.5));
      });

    it('Beginning is correctly identified', () => {
        const expected: Path = new Path(new Color(128, 64, 32, 0.5), 5);
        expected.addPoint(new Point(50, 50));
        expect(tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50))).toEqual([expected]);
    });

    it('Path is properly updated', () => {
        const expected: Path = new Path(new Color(128, 64, 32, 0.5), 5);
        expected.addPoint(new Point(50, 50));
        expected.addPoint(new Point(51, 51));
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        expect(tool.mouseEvent(MouseEventType.MouseMove, new Point(51, 51))).toEqual([expected]);
    });

    it('Path properly finishes', () => {
        const expected: PencilToolCommand = new PencilToolCommand(new Color(128, 64, 32, 0.5), 5);
        expected.path.addPoint(new Point(50, 50));
        expected.path.addPoint(new Point(51, 51));
        expected.path.addPoint(new Point(52, 52));
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(51, 51));
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(52, 52));
        expect(tool.isCommandReady()).toEqual(true);
        expect(tool.getCommand()).toEqual(expected);
    });

    it('Other functions return empty arrays', () => {
        expect(tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseClickRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseDownRight, new Point(0, 0))).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0))).toEqual([]);
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, '')).toEqual([]);
        expect(tool.keyboardEvent(KeyboardEventType.KeyUp, '')).toEqual([]);
        expect(tool.mouseWheelEvent(0)).toEqual([]);
    });
});
