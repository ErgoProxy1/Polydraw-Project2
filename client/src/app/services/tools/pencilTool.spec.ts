import { Path } from '../svgPrimitives/path/path';
import { PencilToolCommand } from '../toolCommands/pencilToolCommand';
import { Color } from '../utils/color';
import { Texture } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {PencilTool} from './pencilTool';

describe('PencilTool', () => {
    const tool: PencilTool = new PencilTool(new Color(128, 64, 32, 0.5));

    it('Beginning is correctly identified', () => {
        const expected: Path = new Path(new Color(128, 64, 32, 0.5), 5, Texture.Basic);
        expected.points = 'M50 50 L50 50';
        expect(tool.begin(new Point(50, 50))).toEqual([expected]);
    });

    it('Path is properly updated', () => {
        const expected: Path = new Path(new Color(128, 64, 32, 0.5), 5, Texture.Basic);
        expected.points = 'M50 50 L50 50 L51 51';
        tool.begin(new Point(50, 50));
        expect(tool.update(new Point(51, 51))).toEqual([expected]);
    });

    it('Path properly finishes', () => {
        const expected: PencilToolCommand = new PencilToolCommand(new Color(128, 64, 32, 0.5), 5);
        expected.path.points = 'M50 50 L50 50 L51 51';
        tool.begin(new Point(50, 50));
        tool.update(new Point(51, 51));
        expect(tool.finish(new Point(52, 52))).toEqual(expected);
    });

    it('Other functions return empty arrays', () => {
        expect(tool.keyDown('a')).toEqual([]);
        expect(tool.keyUp('a')).toEqual([]);
    });
});
