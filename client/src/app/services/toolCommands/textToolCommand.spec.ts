import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { ALIGNS, FONTS } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { TextToolCommand } from './textToolCommand';

describe('TextToolCommand', () => {
    let command: TextToolCommand;
    beforeEach(() => {
        command = new TextToolCommand(
            16, new Color(0, 0, 0, 1), FONTS[0], ALIGNS[0], new Point(50, 50),
            new Perimeter(new Point(50, 50), new Color(0, 0, 0, 1)), false, false,
        );
    });

    it('typing is properly handled', () => {
        command.type('A');
        expect(command.text.lines[0].innertext).toBe('A|');

        command.type(' ');
        expect(command.text.lines[0].innertext).toBe('A\u00A0|');
    });

    it('line breaks are properly handled', () => {
        command.type('A');
        command.break();
        expect(command.text.lines).toEqual([
            { innertext: 'A', position: new Point(50, 50) },
            { innertext: '|', position: new Point(50, 50 + command.text.size) },
        ]);

        command.break();
        expect(command.text.lines).toEqual([
            { innertext: 'A', position: new Point(50, 50) },
            { innertext: '', position: new Point(50, 50 + command.text.size) },
            { innertext: '|', position: new Point(50, 50 + 2 * command.text.size) },
        ]);

        command.type('A');
        command.type('B');
        command.type('C');
        command.updateLinePosition('ArrowLeft');
        command.break();

        expect(command.text.lines).toEqual([
            { innertext: 'A', position: new Point(50, 50) },
            { innertext: '', position: new Point(50, 50 + command.text.size) },
            { innertext: 'AB', position: new Point(50, 50 + 2 * command.text.size) },
            { innertext: '|C', position: new Point(50, 50 + 3 * command.text.size) },
        ]);
    });

    it('deletions are properly handled', () => {
        command.type('A');
        command.type('B');
        command.type('C');
        command.delete();
        command.delete();
        expect(command.text.lines[0].innertext).toBe('A|');

        command.type('A');
        command.updateLinePosition('ArrowLeft');
        command.delete();
        expect(command.text.lines[0].innertext).toBe('|A');

        command.updateLinePosition('ArrowRight');
        command.type('B');
        command.type('C');
        command.break();
        command.type('A');
        command.delete();
        expect(command.text.lines[0].innertext).toBe('ABC');
        expect(command.text.lines.length).toBe(2);

        command.delete();
        expect(command.text.lines[0].innertext).toBe('ABC');
        expect(command.text.lines.length).toBe(1);

        command.delete();
        command.delete();
        command.delete();
        expect(command.text.lines[0].innertext).toBe('|');
    });

    it('position on line is properly updated', () => {
        command.type('A');
        command.type('B');
        command.type('C');

        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[0].innertext).toBe('AB|C');
        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[0].innertext).toBe('A|BC');
        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[0].innertext).toBe('|ABC');
        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[0].innertext).toBe('|ABC');

        command.updateLinePosition('ArrowRight');
        expect(command.text.lines[0].innertext).toBe('A|BC');
        command.updateLinePosition('ArrowRight');
        expect(command.text.lines[0].innertext).toBe('AB|C');
        command.updateLinePosition('ArrowRight');
        expect(command.text.lines[0].innertext).toBe('ABC|');
        command.updateLinePosition('ArrowRight');
        expect(command.text.lines[0].innertext).toBe('ABC|');

        command.break();
        command.type('D');
        command.type('E');
        command.type('F');

        command.updateLinePosition('ArrowUp');
        expect(command.text.lines[0].innertext).toBe('ABC|');
        command.updateLinePosition('ArrowDown');
        expect(command.text.lines[1].innertext).toBe('DEF|');
        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[1].innertext).toBe('DE|F');
        command.updateLinePosition('ArrowDown');
        expect(command.text.lines[1].innertext).toBe('DE|F');
        command.updateLinePosition('ArrowLeft');
        expect(command.text.lines[1].innertext).toBe('D|EF');
        command.updateLinePosition('ArrowUp');
        expect(command.text.lines[0].innertext).toBe('A|BC');
        command.updateLinePosition('ArrowUp');
        expect(command.text.lines[0].innertext).toBe('A|BC');
    });

    it('perimeter is properly resized', () => {
        command.text.setCorners(new Point(50, 50), new Point(100, 100));
        command.updatePerimeter();
        const perimeterPropertyName = 'perimeter';
        expect(command[perimeterPropertyName].getTopLeftCorner()).toEqual(new Point(49, 49));
        expect(command[perimeterPropertyName].getBottomRightCorner()).toEqual(new Point(101, 101));
    });

    it('text is applied properly', () => {
        const primitives: SVGPrimitive[] = Array<SVGPrimitive>();

        command.apply(primitives);
        expect(primitives.length).toBe(1);

        command.apply(primitives);
        expect(primitives.length).toBe(2);
    });

    it('text is canceled properly', () => {
        const primitives: SVGPrimitive[] = Array<SVGPrimitive>();

        command.cancel(primitives);
        expect(primitives.length).toBe(0);

        command.apply(primitives);
        command.apply(primitives);
        command.apply(primitives);

        command.cancel(primitives);
        expect(primitives.length).toBe(2);
    });
});
