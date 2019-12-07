import { TestBed } from '@angular/core/testing';
import { Observable, Subscription } from 'rxjs';
import { BoundingBoxService } from '../boundingBoxService/bounding-box.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { MoveService } from '../move/move.service';
import { ResizeService } from '../resize/resize.service';
import { RotationService } from '../rotation/rotation.service';
import { Handle } from '../svgPrimitives/ellipse/handle/handle';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { MoveCommand } from '../toolCommands/moveCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { DEFAULT_GRID_SIZE, GridAlignment, HandleType, MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Grid } from './grid';
import { SelectorTool } from './selectorTool';

describe('SelectorTool', () => {
  let tool: SelectorTool;
  let rectangle1: Rectangle;
  let rectangle2: Rectangle;
  let rectangle3: Rectangle;

  // tslint:disable-next-line: only-arrow-functions
  function movePrimitivesWithoutMouseUp(translation: Point): void {
      tool.updatePrimitivesList([rectangle1, rectangle2, rectangle3]);
      rectangle1.selected = true;
      rectangle2.selected = true;
      rectangle3.selected = true;
      const point: Point = new Point(80, 80);
      tool.mouseEvent(MouseEventType.MouseDownLeft, point);
      tool.mouseEvent(MouseEventType.MouseMove, Point.sumPoints(point, translation));
      tool.getTemporaryPrimitives();
  }

  beforeEach(() => {
      TestBed.configureTestingModule({});
      tool = new SelectorTool(TestBed.get(ClipboardService), TestBed.get(BoundingBoxService), TestBed.get(ResizeService),
                              TestBed.get(MoveService), TestBed.get(RotationService), DEFAULT_GRID_SIZE, new Observable<Grid>());
      const point1: Point = new Point(50, 50);
      const point2: Point = new Point(55, 55);
      const point3: Point = new Point(100, 100);
      const point4: Point = new Point(105, 105);
      const point5: Point = new Point(150, 150);
      const point6: Point = new Point(155, 155);
      rectangle1 = new Rectangle(new Color(64, 64, 64, 1), new Color(32, 32, 32, 1), 5, StrokeType.FullWithOutline, point1);
      rectangle2 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point3);
      rectangle3 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point5);
      rectangle1.resize(point1, point2, false, true);
      rectangle2.resize(point3, point4, false, true);
      rectangle3.resize(point5, point6, false, true);
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
      tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(51, 51), rectangle1);
      tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(51, 51), rectangle1);
      expect(rectangle1.selected).toBe(true);
  });

  it('A left click on a selectable primitive should select it and unselect others', () => {
      rectangle1.selected = true;
      rectangle2.selected = true;
      tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(151, 151), rectangle3);
      tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(151, 151), rectangle3);
      expect(rectangle1.selected).toBe(false);
      expect(rectangle2.selected).toBe(false);
      expect(rectangle3.selected).toBe(true);
  });

  it('A right click on an unselected selectable primitive should select it', () => {
      rectangle1.selected = false;
      tool.mouseEvent(MouseEventType.MouseDownRight, new Point(51, 51), rectangle1);
      tool.mouseEvent(MouseEventType.MouseUpRight, new Point(51, 51), rectangle1);
      expect(rectangle1.selected).toBe(true);
  });

  it('A right click on a selected selectable primitive should unselect it', () => {
      rectangle1.selected = true;
      tool.mouseEvent(MouseEventType.MouseDownRight, new Point(51, 51), rectangle1);
      tool.mouseEvent(MouseEventType.MouseUpRight, new Point(51, 51), rectangle1);
      expect(rectangle1.selected).toBe(false);
  });

  it('A right click on a selectable primitive should keep the selection state of other primitives', () => {
      rectangle1.selected = true;
      rectangle2.selected = true;
      tool.mouseEvent(MouseEventType.MouseDownRight, new Point(151, 151), rectangle3);
      tool.mouseEvent(MouseEventType.MouseUpRight, new Point(151, 151), rectangle3);
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
      tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(230, 230));
      tool.mouseEvent(MouseEventType.MouseMove, new Point(211, 211));
      tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(211, 211));
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
      const handle: Handle = new Handle(new Point(200, 200), HandleType.Top);
      tool.updatePrimitivesList([rectangle1, rectangle2, rectangle3, handle]);
      rectangle3.selected = true;
      rectangle1.selected = true;
      rectangle2.selected = true;
      tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(200, 200), handle);
      expect(rectangle1.selected).toBe(true);
      expect(rectangle2.selected).toBe(true);
      expect(rectangle3.selected).toBe(true);
  });

  it('A MouseDown inside the bounding box of selected primitives should hide them and create copies of them', () => {
      tool.updatePrimitivesList([rectangle1, rectangle2, rectangle3]);
      const expectedRectangle1: Rectangle = rectangle1.copy();
      const expectedRectangle2: Rectangle = rectangle2.copy();
      const expectedRectangle3: Rectangle = rectangle3.copy();
      rectangle1.selected = true;
      rectangle2.selected = true;
      rectangle3.selected = true;
      tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(80, 80));
      expect(rectangle1.selected).toBe(true);
      expect(rectangle2.selected).toBe(true);
      expect(rectangle3.selected).toBe(true);
      expect(rectangle1.toShow).toBe(false);
      expect(rectangle2.toShow).toBe(false);
      expect(rectangle3.toShow).toBe(false);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle1);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle2);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle3);
  });

  it('A MouseMove after a MouseDown occured inside the bounding box of selected primitives should move copies of the primitives', () => {
      const translation: Point = new Point(20, 20);
      const expectedRectangle1: Rectangle = rectangle1.copy();
      const expectedRectangle2: Rectangle = rectangle2.copy();
      const expectedRectangle3: Rectangle = rectangle3.copy();
      expectedRectangle1.move(translation);
      expectedRectangle2.move(translation);
      expectedRectangle3.move(translation);
      movePrimitivesWithoutMouseUp(translation);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle1);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle2);
      expect(tool.getTemporaryPrimitives()).toContain(expectedRectangle3);
  });

  it('A left MouseUp should produce a MoveCommand when moving a selection and delete copies of them', () => {
      const translation: Point = new Point(20, 20);
      const expectedCommand: MoveCommand = new MoveCommand([rectangle1, rectangle2, rectangle3], translation);
      const subscription: Subscription = tool.subscribeToCommand().subscribe((command: ToolCommand) => {
          expect(command).toEqual(expectedCommand);
          subscription.unsubscribe();
      });
      const expectedRectangle1: Rectangle = rectangle1.copy();
      const expectedRectangle2: Rectangle = rectangle2.copy();
      const expectedRectangle3: Rectangle = rectangle3.copy();
      expectedRectangle1.move(translation);
      expectedRectangle2.move(translation);
      expectedRectangle3.move(translation);
      movePrimitivesWithoutMouseUp(translation);
      tool.mouseEvent(MouseEventType.MouseUpLeft, new Point(100, 100));
      expect(tool.getTemporaryPrimitives()).not.toContain(expectedRectangle1);
      expect(tool.getTemporaryPrimitives()).not.toContain(expectedRectangle2);
      expect(tool.getTemporaryPrimitives()).not.toContain(expectedRectangle3);
  });

  it('The bounding box should snap to the grid using its top left corner if magnetism is enabled with the top left corner', () => {
      tool.gridAlignment = GridAlignment.TopLeft;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getTopLeftCorner();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  it('The bounding box should snap to the grid using its bottom left corner if magnetism is enabled with the bottom left corner', () => {
      tool.gridAlignment = GridAlignment.BottomLeft;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getBottomLeftCorner();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  // tslint:disable-next-line: max-line-length
  it('The bounding box should snap to the grid using its center left position if magnetism is enabled with the center left position', () => {
      tool.gridAlignment = GridAlignment.CenterLeft;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getCenterLeftPosition();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  it('The bounding box should snap to the grid using its top right corner if magnetism is enabled with the top right corner', () => {
      tool.gridAlignment = GridAlignment.TopRight;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getTopRightCorner();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  it('The bounding box should snap to the grid using its bottom right corner if magnetism is enabled with the bottom right corner', () => {
      tool.gridAlignment = GridAlignment.BottomRight;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getBottomRightCorner();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  // tslint:disable-next-line: max-line-length
  it('The bounding box should snap to the grid using its center right position if magnetism is enabled with the center right position', () => {
      tool.gridAlignment = GridAlignment.CenterRight;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getCenterRightPosition();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  it('The bounding box should snap to the grid using its top center position if magnetism is enabled with the top center position', () => {
      tool.gridAlignment = GridAlignment.TopCenter;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getTopCenterPosition();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  // tslint:disable-next-line: max-line-length
  it('The bounding box should snap to the grid using its bottom center position if magnetism is enabled with the bottom center position', () => {
      tool.gridAlignment = GridAlignment.BottomCenter;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].getBottomCenterPosition();
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });

  it('The bounding box should snap to the grid using its center position if magnetism is enabled with the center position', () => {
      tool.gridAlignment = GridAlignment.Center;
      movePrimitivesWithoutMouseUp(new Point(20, 20));
      tool.getTemporaryPrimitives();
      // tslint:disable-next-line: no-string-literal
      const corner: Point = tool['boundingBox'].center;
      // tslint:disable-next-line: no-string-literal
      expect(corner.x % tool['gridSquareSize']).toEqual(0);
      // tslint:disable-next-line: no-string-literal
      expect(corner.y % tool['gridSquareSize']).toEqual(0);
  });
});
