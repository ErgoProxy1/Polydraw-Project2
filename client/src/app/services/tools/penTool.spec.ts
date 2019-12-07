import { TestBed } from '@angular/core/testing';
import { Color } from '../utils/color';
import { DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH, DEFAULT_PEN_STROKE_WIDTH,
  MouseEventType, ToolType} from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import {PenTool} from './penTool';

describe('PenTool', () => {
    let penTool: PenTool = new PenTool(new Color(100, 150, 250, 0.5));

    beforeEach(() => {
        TestBed.configureTestingModule({  });
        penTool = new PenTool(new Color(100, 150, 250, 0.5));
      });

    it('should be properly created', () => {
    expect(penTool).toBeTruthy();
    expect(penTool.TYPE).toEqual(ToolType.Pen);
    expect(penTool.strokeWidth).toBe(DEFAULT_PEN_STROKE_WIDTH);
    expect(penTool.minStrokeWidth).toBe(DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH);
    });

    it('#mouseEvent should set properly the command path property', () => {
      penTool.mouseEvent(MouseEventType.MouseClickLeft, new Point(0, 0));
      expect(penTool.getTemporaryPrimitives()).toEqual([]);
      penTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(10, 30));
      expect(penTool.getTemporaryPrimitives().length).toBe(1);
      penTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(40, 50));
      expect(penTool.getTemporaryPrimitives().length).toBe(1);
      penTool.mouseEvent(MouseEventType.MouseLeave, new Point(0, 0));
      expect(penTool.getTemporaryPrimitives()).toEqual([]);
    });

    it('#updateStrokeWidth should set the command path and strokeWidth', () => {
      penTool.strokeWidth = 14;
      penTool.initialPosition = new Point(120, 240);
      penTool.startTime = Date.now() + 30;
      penTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(150, 300));
      penTool.mouseEvent(MouseEventType.MouseMove, new Point(150, 300));
      penTool.updateStrokeWidth(new Point(150, 300));
      expect(penTool.subscribeToCommand().subscribe()).toBeDefined();
    });
});
