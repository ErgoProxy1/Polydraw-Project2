
import { TestBed } from '@angular/core/testing';
import { Color } from '../utils/color';
// tslint:disable-next-line
import { DEFAULT_LINE_STROKE_WIDTH, KeyboardEventType, LineCap, LineJoin, MouseEventType, Pattern, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { LineTool } from './lineTool';

describe('LineTool', () => {
  let lineTool: LineTool;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
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

  it('#mouseEvent should catch the mouseEvent and do the properly action', () => {
    const position: Point = new Point(50, 70);
    lineTool.mouseEvent(MouseEventType.MouseDblClick, position);
    expect(lineTool.getTemporaryPrimitives()).toEqual([]);
    lineTool.mouseEvent(MouseEventType.MouseDownLeft, position);
    expect(lineTool.getTemporaryPrimitives()).toEqual([]);
    lineTool.mouseEvent(MouseEventType.MouseClickLeft, position);
    expect(lineTool.getTemporaryPrimitives().length).toEqual(1);
  });

  it('#keyboardEvent should catch the KeyboardEvent and do the properly action', () => {
    lineTool.keyboardEvent(KeyboardEventType.ShiftDown);
    expect(lineTool.getTemporaryPrimitives()).toEqual([]);
  });

  it('#mouseWheelEvent should catch the MouseEvent and do the properly action', () => {
    lineTool.mouseWheelEvent(10);
    expect(lineTool.getTemporaryPrimitives()).toEqual([]);
  });
});
