import { TestBed } from '@angular/core/testing';
import { Spraypaint } from '../svgPrimitives/spraypaint/spraypaint';
import { Color } from '../utils/color';
import { DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE,
    MouseEventType, PrimitiveType, SPRAYPAINT_FLOW_SIZE, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { SpraypaintTool } from './spraypaintTool';

// tslint:disable: no-string-literal
describe('SpraypaintTool', () => {
    let spraytool: SpraypaintTool;

    beforeEach(() => {
        TestBed.configureTestingModule({  });
        spraytool = new SpraypaintTool(new Color(128, 64, 32, 0.5), DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
      });

    it('should be properly created', () => {
        expect(spraytool).toBeTruthy();
        expect(spraytool.paintDelay).toEqual(DEFAULT_SPRAYPAINT_DELAY);
        expect(spraytool.range).toEqual(DEFAULT_SPRAYPAINT_RANGE);
        expect(spraytool.TYPE).toEqual(ToolType.SpraypaintTool);
    });

    it('Beginning is correctly identified', () => {
        const expected: Spraypaint = new Spraypaint(new Color(128, 64, 32, 0.5), DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
        expected.spray(new Point(50, 50));
        spraytool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
        expect(expected.points.length).toEqual(SPRAYPAINT_FLOW_SIZE);
        expect(spraytool.getTemporaryPrimitives().length).toEqual([expected].length);
        expect(spraytool.isDrawing).toBe(true);
    });

    it('Spraypaint is properly updated', () => {
        const expected: Spraypaint = new Spraypaint(new Color(128, 64, 32, 0.5),
        DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
        expected.spray(new Point(100, 100));
        spraytool.mouseEvent(MouseEventType.MouseDownLeft, new Point(100, 100));
        spraytool.mouseEvent(MouseEventType.MouseMove, new Point(200, 200));
        expect(spraytool['command'].spraypaint.points.length).toBe(2 * SPRAYPAINT_FLOW_SIZE);
        expect(spraytool.isDrawing).toBe(true);
    });

    it('Spraypaint is properly finished', () => {
        const expected: Spraypaint = new Spraypaint(new Color(128, 64, 32, 0.5),
        DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
        expected.spray(new Point(100, 100));
        spraytool.mouseEvent(MouseEventType.MouseDownLeft, new Point(100, 100));
        spraytool.mouseEvent(MouseEventType.MouseMove, new Point(200, 200));
        spraytool.mouseEvent(MouseEventType.MouseUpLeft, new Point(205, 205));
        expect(spraytool['command'].spraypaint.points.length).toBe(2 * SPRAYPAINT_FLOW_SIZE);
        expect(spraytool.isDrawing).toBe(false);
    });

    it('Temporary primitives are properly detected', () => {
        expect(spraytool.getTemporaryPrimitives()).toEqual([]);
        const expected: Spraypaint = new Spraypaint(new Color(128, 64, 32, 0.5),
        DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
        expected.spray(new Point(100, 100));
        spraytool.mouseEvent(MouseEventType.MouseDownLeft, new Point(100, 100));
        expect(spraytool.getTemporaryPrimitives()[0].type).toEqual(PrimitiveType.Spraypaint);
    });
});
