import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {ColorApplicatorTool} from './colorApplicatorTool';

describe('ColorApplicatorTool', () => {
    const tool: ColorApplicatorTool = new ColorApplicatorTool(new Color(128, 64, 32, 0.5), new Color(0, 255, 127, 1));
    const rectangle: Rectangle = new Rectangle(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 50, 50,
    );
    const commandAttributeName = 'command';

    it('Tool command is properly returned when the tool is used with a left click on a rectangle', () => {
        const expected: ColorApplicatorToolCommand = new ColorApplicatorToolCommand(rectangle, true, new Color(128, 64, 32, 0.5));
        tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0), rectangle);
        expect(tool[commandAttributeName]).toEqual(expected);
    });

    it('Other functions return empty arrays', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseEvent(MouseEventType.MouseDownRight, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0), rectangle);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.keyboardEvent(KeyboardEventType.ShiftDown);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.keyboardEvent(KeyboardEventType.ShiftUp);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseWheelEvent(0);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
    });
});
