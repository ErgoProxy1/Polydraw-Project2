
import { TestBed } from '@angular/core/testing';
import { Color } from '../utils/color';
import { DEFAULT_LINE_STROKE_WIDTH, KeyboardEventType, LineCap, LineJoin,
    MouseEventType, Pattern, SHIFT_KEY_CODE, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {LineTool} from './lineTool';

describe('LineTool', () => {
    let lineTool: LineTool = new LineTool(new Color(128, 64, 32, 0.5));

    beforeEach(() => {
        TestBed.configureTestingModule({});
        lineTool = new LineTool(new Color(128, 64, 32, 0.5));
      });

    it('should be properly created', () => {
        expect(lineTool).toBeTruthy();
        expect(lineTool.strokeWidth).toBe(DEFAULT_LINE_STROKE_WIDTH);
        expect(lineTool.pattern).toBe(Pattern.FullLine);
        expect(lineTool.lineJoin).toBe(LineJoin.Round);
        expect(lineTool.type).toBe(ToolType.Line);
        expect(lineTool.lineCap).toBe(LineCap.Butt);
    });

    it('#mouseEvent should catch the mouseEvent and do the properly action', () => {
        const position: Point = new Point(50, 70);
        expect(lineTool.mouseEvent(MouseEventType.MouseDblClick, position)).toEqual([]);
        expect(lineTool.mouseEvent(MouseEventType.MouseDownLeft, position)).toEqual([]);
        expect(lineTool.mouseEvent(MouseEventType.MouseClickLeft, position).length).toEqual(1);
    });

    it('#keyboardEvent should catch the KeyboardEvent and do the properly action', () => {
        expect(lineTool.keyboardEvent(KeyboardEventType.ShiftKey, SHIFT_KEY_CODE)).toEqual([]);
        expect(lineTool.keyboardEvent(KeyboardEventType.KeyDown, SHIFT_KEY_CODE)).toEqual([]);
    });

    it('#mouseWheelEvent should catch the MouseEvent and do the properly action', () => {
        expect(lineTool.mouseWheelEvent(10)).toEqual([]);
    });

    it('#isCommandReady should get the isCommandReady attribute', () => {
        expect(lineTool.isCommandReady()).toEqual(false);
    });

    it('#getCommand should get the isCommandReady attribute', () => {
        expect(lineTool.getCommand()).toBeUndefined();
    });

    it('#getCommand should get the isCommandReady attribute', () => {
        expect(lineTool.getCommand()).toBeUndefined();
    });
});
