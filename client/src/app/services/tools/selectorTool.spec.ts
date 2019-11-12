import { TestBed } from '@angular/core/testing';
import { ClipboardService } from '../clipboard/clipboard.service';
import { Handle } from '../svgPrimitives/ellipse/handle/handle';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { SelectorTool } from './selectorTool';

describe('SelectorTool', () => {
    let tool: SelectorTool;
    let rectangle1: Rectangle;
    let rectangle2: Rectangle;
    let rectangle3: Rectangle;

    beforeEach(() => {
      TestBed.configureTestingModule({});
    });

    beforeEach(() => {
        tool = new SelectorTool(TestBed.get(ClipboardService));
        const point1: Point = new Point(50, 50);
        const point2: Point = new Point(55, 55);
        const point3: Point = new Point(100, 100);
        const point4: Point = new Point(105, 105);
        const point5: Point = new Point(150, 150);
        const point6: Point = new Point(155, 155);
        rectangle1 = new Rectangle(new Color(64, 64, 64, 1), new Color(32, 32, 32, 1), 5, StrokeType.FullWithOutline, point1);
        rectangle2 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point3);
        rectangle3 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point5);
        rectangle1.resize(point1, point2, false);
        rectangle2.resize(point3, point4, false);
        rectangle3.resize(point5, point6, false);
        rectangle1.selected = false;
        rectangle2.selected = false;
        rectangle3.selected = false;
        tool.updatePrimitivesList([rectangle1, rectangle2, rectangle3]);
    });

    it('Primitives list is properly updated', () => {
        tool.updatePrimitivesList([rectangle1, rectangle2]);
        expect(tool.getPrimitivesList()).toEqual([rectangle1, rectangle2]);
    });

    it('Selections are properly reset', () => {
        tool.resetSelection();
        expect(rectangle1.selected).toBe(false);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(false);
    });

    it('A left click on a selectable primitive should select it', () => {
        tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(51, 51), rectangle1);
        expect(rectangle1.selected).toBe(true);
    });

    it('A left click on a selectable primitive should select it and unselect others', () => {
        rectangle1.selected = true;
        rectangle2.selected = true;
        tool.mouseEvent(MouseEventType.MouseClickLeft, new Point(151, 151), rectangle3);
        expect(rectangle1.selected).toBe(false);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(true);
    });

    it('A right click on an unselected selectable primitive should select it', () => {
        rectangle1.selected = false;
        tool.mouseEvent(MouseEventType.MouseClickRight, new Point(51, 51), rectangle1);
        expect(rectangle1.selected).toBe(true);
    });

    it('A right click on a selected selectable primitive should unselect it', () => {
        rectangle1.selected = true;
        tool.mouseEvent(MouseEventType.MouseClickRight, new Point(51, 51), rectangle1);
        expect(rectangle1.selected).toBe(false);
    });

    it('A right click on a selectable primitive should keep the selection state of other primitives', () => {
        rectangle1.selected = true;
        rectangle2.selected = true;
        tool.mouseEvent(MouseEventType.MouseClickRight, new Point(151, 151), rectangle3);
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
    });

    it('Using the selection rectangle should select all the primitives that are inside or intersect with it', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(21, 21));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(101, 101));
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(101, 101));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(false);
    });

    it('Using the selection rectangle should unselect all the primitives that are outside of it', () => {
        rectangle1.selected = true;
        rectangle2.selected = true;
        rectangle3.selected = true;
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(130, 130));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(111, 111));
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(111, 111));
        expect(rectangle1.selected).toBe(false);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(false);
    });

    it('Using the selection rectangle should update selection dynamically', () => {
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(21, 21));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(101, 101));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(false);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(160, 160));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(true);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(60, 60));
        tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(60, 60));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(false);
    });

    it('Using the inversion rectangle should reverse the selection state of primitives that are inside or intersect with it', () => {
        rectangle1.selected = false;
        rectangle2.selected = true;
        tool.mouseEvent(MouseEventType.MouseDownRight, new Point(21, 21));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(101, 101));
        tool.mouseEvent(MouseEventType.MouseUpRight, new Point(101, 101));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(false);
    });

    it('Using the inversion rectangle should not change the selection state of the primitives that are outside of it', () => {
        rectangle1.selected = true;
        rectangle2.selected = true;
        rectangle3.selected = true;
        tool.mouseEvent(MouseEventType.MouseDownRight, new Point(130, 130));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(111, 111));
        tool.mouseEvent(MouseEventType.MouseUpRight, new Point(111, 111));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(true);
    });

    it('Using the inversion rectangle should update selection dynamically', () => {
        tool.mouseEvent(MouseEventType.MouseDownRight, new Point(21, 21));
        tool.mouseEvent(MouseEventType.MouseMove, new Point(101, 101));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(false);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(160, 160));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(true);
        tool.mouseEvent(MouseEventType.MouseMove, new Point(60, 60));
        tool.mouseEvent(MouseEventType.MouseUpRight, new Point(60, 60));
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(false);
    });

    it('A MouseDown with the left button on nothing should unselect every primitive', () => {
        rectangle1.selected = true;
        rectangle2.selected = true;
        rectangle3.selected = true;
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(1000, 1000));
        expect(rectangle1.selected).toBe(false);
        expect(rectangle2.selected).toBe(false);
        expect(rectangle3.selected).toBe(false);
    });

    it('A MouseDown with the left button on an unselectable primitive should have no effect', () => {
        const handle: Handle = new Handle(new Point(200, 200));
        tool.updatePrimitivesList([rectangle1, rectangle2, rectangle3, handle]);
        rectangle3.selected = true;
        rectangle1.selected = true;
        rectangle2.selected = true;
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(200, 200), handle);
        expect(rectangle1.selected).toBe(true);
        expect(rectangle2.selected).toBe(true);
        expect(rectangle3.selected).toBe(true);
    });

});
