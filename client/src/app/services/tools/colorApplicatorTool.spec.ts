import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {ColorApplicatorTool} from './colorApplicatorTool';

describe('ColorApplicatorTool', () => {
    const tool: ColorApplicatorTool = new ColorApplicatorTool(new Color(128, 64, 32, 0.5), new Color(0, 255, 127, 1));
    const rectangle: Rectangle = new Rectangle(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 50, 50,
    );

    it('Tool command is properly returned when the tool is used with a left click on a rectangle', () => {
        const expected: ColorApplicatorToolCommand = new ColorApplicatorToolCommand(rectangle, true, new Color(128, 64, 32, 0.5));
        expected.lastColor = new Color(64, 64, 64, 0.5);
        tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0), rectangle);
        expect(tool.isCommandReady()).toEqual(true);
        const returned: ToolCommand = tool.getCommand();
        returned.apply();
        expect(returned).toEqual(expected);
    });

    it('Other functions return empty arrays', () => {
        expect(tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseDownRight, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseUpRight, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.MouseMove, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.mouseEvent(MouseEventType.InvalidEvent, new Point(0, 0), rectangle)).toEqual([]);
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, '')).toEqual([]);
        expect(tool.keyboardEvent(KeyboardEventType.KeyUp, '')).toEqual([]);
        expect(tool.mouseWheelEvent(0)).toEqual([]);
    });
});
