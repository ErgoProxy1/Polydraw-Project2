import { Quill } from '../svgPrimitives/quill/quill';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { QuillTool } from './quillTool';

// tslint:disable: no-string-literal
describe('QuillTool', () => {
    let tool: QuillTool;

    beforeEach(() => {
        tool = new QuillTool(Color.BLACK);
    });

    it('is properly constructed', () => {
        expect(tool).toBeTruthy();
        expect(tool.angle).toBe(0);
        expect(tool.baseLength).toBe(15);
        expect(tool.rotationRate).toBe(15);
        expect(tool.strokeColor).toEqual(Color.BLACK);
        expect(tool.currentPosition).toBeUndefined();
        expect(tool.oldPosition).toBeUndefined();
        expect(tool.quillCursor).toEqual(new Quill(Color.BLACK));
        expect(tool.showCursor).toBe(true);
        expect(tool.isDrawing).toBe(false);
    });

    it('quill is properly started', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        expect(tool.showCursor).toBe(true);
        expect(tool.oldPosition).toEqual(tool.currentPosition);
        expect(tool.isDrawing).toBe(true);
        expect(tool['command'].quill.linePoints).toEqual(['', '58,50 42,50 42,50 58,50 ']);
    });

    it('quill is properly updated', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        expect(tool.showCursor).toBe(true);
        expect(tool.oldPosition).toEqual(tool.currentPosition);
        expect(tool.isDrawing).toBe(true);
        expect(tool['command'].quill.linePoints).toEqual(['', '58,50 42,50 42,50 58,50 ', '58,50 42,50 47,55 63,55 ']);
    });

    it('quill is properly finished', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(55, 55));
        expect(tool.showCursor).toBe(true);
        expect(tool.oldPosition).toEqual(tool.currentPosition);
        expect(tool.isDrawing).toBe(false);
        expect(tool['command'].quill.linePoints).toEqual(['', '58,50 42,50 42,50 58,50 ', '58,50 42,50 47,55 63,55 ']);

        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        tool.mouseEvent(MouseEventType.MouseLeave, new Point(55, 55));
        expect(tool.showCursor).toBe(false);
        expect(tool.oldPosition).toEqual(tool.currentPosition);
        expect(tool.isDrawing).toBe(false);
        expect(tool['command'].quill.linePoints).toEqual(['', '58,50 42,50 42,50 58,50 ', '58,50 42,50 47,55 63,55 ']);
    });

    it('keyboard events are properly handled', () => {
        tool.keyboardEvent(KeyboardEventType.AltDown);
        expect(tool.rotationRate).toBe(1);

        tool.keyboardEvent(KeyboardEventType.AltUp);
        expect(tool.rotationRate).toBe(15);
    });

    it('wheel events are properly handled', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));

        tool.angle = 30;
        tool.mouseWheelEvent(1);
        expect(tool.angle).toBe(15);

        tool.angle = 30;
        tool.mouseWheelEvent(-1);
        expect(tool.angle).toBe(45);

        tool.angle = 450;
        tool.mouseWheelEvent(-1);
        expect(tool.angle).toBe(0);

        tool.angle = -400;
        tool.mouseWheelEvent(-1);
        expect(tool.angle).toBe(0);
    });

    it('wheel events can be triggered while drawing', () => {
        tool.angle = 0;
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        expect(tool.angle).toBe(0);
        expect(tool['command'].quill.linePoints).toEqual(['', '58,50 42,50 42,50 58,50 ', '58,50 42,50 47,55 63,55 ']);

        tool.mouseWheelEvent(1);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(60, 60));
        expect(tool.angle).toBe(-15);
        expect(tool['command'].quill.linePoints).toEqual([
            '', '58,50 42,50 42,50 58,50 ', '58,50 42,50 47,55 63,55 ', '63,55 47,55 48,53 62,57 ', '62,57 48,53 53,58 67,62 ',
        ]);
    });

    it('temporary primtives are properly shown', () => {
        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        expect(tool.getTemporaryPrimitives()).toEqual([tool.quillCursor]);

        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        expect(tool.getTemporaryPrimitives()).toEqual([tool['command'].quill, tool.quillCursor]);
    });

    it('cursor is correctly updated', () => {
        expect(tool.getCursor()).toBe('none');

        tool.mouseEvent(MouseEventType.MouseMove, new Point(55, 55));
        expect(tool.quillCursor.linePoints).toEqual(['63,55 47,55 ']);

        tool.mouseWheelEvent(1);
        expect(tool.quillCursor.linePoints).toEqual(['62,57 48,53 ']);
    });
});
