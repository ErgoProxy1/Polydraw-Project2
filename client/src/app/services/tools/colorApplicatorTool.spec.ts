import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {ColorApplicatorTool} from './colorApplicatorTool';

describe('ColorApplicatorTool', () => {
    const tool: ColorApplicatorTool = new ColorApplicatorTool(new Color(128, 64, 32, 0.5), new Color(0, 255, 127, 1));
    const rectangle: Rectangle = new Rectangle(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 50, 50,
    );

    it('Tool command is properly returned', () => {
        const expected: ColorApplicatorToolCommand = new ColorApplicatorToolCommand(rectangle, true, new Color(128, 64, 32, 0.5));
        expected.lastColor = new Color(64, 64, 64, 0.5);
        expect(tool.finish(new Point(50, 50), true, rectangle)).toEqual(expected);
    });

    it('Other functions return empty arrays', () => {
        expect(tool.begin(new Point(50, 50))).toEqual([]);
        expect(tool.update(new Point(50, 50))).toEqual([]);
        expect(tool.keyDown('a')).toEqual([]);
        expect(tool.keyUp('a')).toEqual([]);
    });
});
