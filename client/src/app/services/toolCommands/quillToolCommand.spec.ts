import { Quill } from '../svgPrimitives/quill/quill';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { Point } from '../utils/point';
import { QuillToolCommand } from './quillToolCommand';

describe('QuillToolCommand', () => {
    let command: QuillToolCommand;

    beforeEach(() => {
        command = new QuillToolCommand(Color.BLACK);
    });

    it('is properly constructed', () => {
        expect(command).toBeTruthy();
        expect(command.quill).toEqual(new Quill(Color.BLACK));
        expect(command.quill.lengthX).toEqual(0);
        expect(command.quill.lengthY).toEqual(0);
    });

    it('quill rendering points are properly placed', () => {
        command.quill.addPoints(new Point(55, 55), new Point(50, 50), 0, 15);
        expect(command.quill.linePoints).toEqual(['', '58,50 42,50 47,55 63,55 ']);

        command.quill.addPoints(new Point(60, 60), new Point(55, 55), 0, 15);
        expect(command.quill.linePoints).toEqual(['', '58,50 42,50 47,55 63,55 ', '63,55 47,55 52,60 68,60 ']);
    });

    it('quill lengths are properly calculated', () => {
        command.quill.calculateLengths(0, 15);
        expect(command.quill.lengthX).toBe(8);
        expect(command.quill.lengthY).toBe(0);

        command.quill.calculateLengths(45, 15);
        expect(command.quill.lengthX).toBe(5);
        expect(command.quill.lengthY).toBe(-5);
    });

    it('quill is applied properly', () => {
        const primitives: SVGPrimitive[] = Array<SVGPrimitive>();

        command.apply(primitives);
        expect(primitives.length).toBe(1);

        command.apply(primitives);
        expect(primitives.length).toBe(2);
    });

    it('quill is canceled properly', () => {
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
