import { TestBed } from '@angular/core/testing';

import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { MoveCommand } from '../toolCommands/moveCommand';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { MoveService } from './move.service';

describe('MoveService', () => {
  let service: MoveService;
  let rectangle1: Rectangle;
  let rectangle2: Rectangle;
  let rectangle3: Rectangle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MoveService);

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
  });

  it('should be created', () => {
    service = TestBed.get(MoveService);
    expect(service).toBeTruthy();
  });

  it('#beginMove should copy the list of primitives and hide the originals', () => {
    service.beginMove([rectangle1, rectangle2, rectangle3]);
    const expectedRectangle1: Rectangle = rectangle1.copy() as Rectangle;
    const expectedRectangle2: Rectangle = rectangle2.copy() as Rectangle;
    const expectedRectangle3: Rectangle = rectangle3.copy() as Rectangle;
    expect(rectangle1.toShow).toBe(false);
    expect(rectangle2.toShow).toBe(false);
    expect(rectangle3.toShow).toBe(false);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle1);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle2);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle3);
  });

  it('#updateMove should do nothing when called before beginMove()', () => {
    const translation: Point = new Point(20, 20);
    const expectedRectangle1: Rectangle = rectangle1.copy() as Rectangle;
    const expectedRectangle2: Rectangle = rectangle2.copy() as Rectangle;
    const expectedRectangle3: Rectangle = rectangle3.copy() as Rectangle;
    service.updateMove(translation);
    expect(rectangle1).toEqual(expectedRectangle1);
    expect(rectangle2).toEqual(expectedRectangle2);
    expect(rectangle3).toEqual(expectedRectangle3);
  });

  it('#updateMove should move each primitive in the list of copies when called after beginMove() using the specified translation', () => {
    service.beginMove([rectangle1, rectangle2, rectangle3]);
    const translation: Point = new Point(20, 20);
    const expectedRectangle1: Rectangle = rectangle1.copy() as Rectangle;
    const expectedRectangle2: Rectangle = rectangle2.copy() as Rectangle;
    const expectedRectangle3: Rectangle = rectangle3.copy() as Rectangle;
    expectedRectangle1.move(translation);
    expectedRectangle2.move(translation);
    expectedRectangle3.move(translation);
    service.updateMove(translation);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle1);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle2);
    expect(service.getTemporaryPrimitives()).toContain(expectedRectangle3);
  });

  it('#endMove should set the primitives to visible and return a move command corresponding to the translation passed in parameter', () => {
      const translation: Point = new Point(20, 20);
      const expectedCommand: MoveCommand = new MoveCommand([rectangle1, rectangle2, rectangle3], translation);
      const expectedRectangle1: Rectangle = rectangle1.copy() as Rectangle;
      const expectedRectangle2: Rectangle = rectangle2.copy() as Rectangle;
      const expectedRectangle3: Rectangle = rectangle3.copy() as Rectangle;
      expectedRectangle1.move(translation);
      expectedRectangle2.move(translation);
      expectedRectangle3.move(translation);
      const command: MoveCommand = service.endMove([rectangle1, rectangle2, rectangle3], translation);
      expect(service.getTemporaryPrimitives()).not.toContain(expectedRectangle1);
      expect(service.getTemporaryPrimitives()).not.toContain(expectedRectangle2);
      expect(service.getTemporaryPrimitives()).not.toContain(expectedRectangle3);
      expect(rectangle1.toShow).toBe(true);
      expect(rectangle2.toShow).toBe(true);
      expect(rectangle3.toShow).toBe(true);
      expect(command).toEqual(expectedCommand);
  });
});
