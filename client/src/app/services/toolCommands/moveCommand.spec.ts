import { TestBed } from '@angular/core/testing';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { MoveCommand } from './moveCommand';

describe('MoveCommand', () => {
  let command: MoveCommand;
  let rectangle1: Rectangle;
  let rectangle2: Rectangle;
  let rectangle3: Rectangle;
  let translation: Point;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const point1: Point = new Point(50, 50);
    const point2: Point = new Point(55, 55);
    const point3: Point = new Point(100, 100);
    const point4: Point = new Point(105, 105);
    const point5: Point = new Point(150, 150);
    const point6: Point = new Point(155, 155);
    translation = new Point(50, -50);
    rectangle1 = new Rectangle(new Color(64, 64, 64, 1), new Color(32, 32, 32, 1), 5, StrokeType.FullWithOutline, point1);
    rectangle2 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point3);
    rectangle3 = new Rectangle(new Color(16, 16, 16, 1), new Color(0, 0, 0, 1), 5, StrokeType.FullWithOutline, point5);
    rectangle1.resize(point1, point2, false);
    rectangle2.resize(point3, point4, false);
    rectangle3.resize(point5, point6, false);
    rectangle1.selected = false;
    rectangle2.selected = false;
    rectangle3.selected = false;
    command = new MoveCommand([rectangle1, rectangle2], translation);
  });

  it('should be properly created', () => {
    expect(command).toBeTruthy();

  });

  it('should be properly created', () => {
    expect(command).toBeTruthy();
  });

  it('#apply should move the selected primitives' , () => {
    const expectedRectangle1: Rectangle = rectangle1.copy();
    expectedRectangle1.move(translation);
    const expectedRectangle2: Rectangle = rectangle2.copy();
    expectedRectangle2.move(translation);
    command.apply([rectangle1, rectangle2]);
    expect(rectangle1).toEqual(expectedRectangle1);
    expect(rectangle2).toEqual(expectedRectangle2);
  });

  it('#apply should not move a primitive that is not selected' , () => {
    const expectedRectangle3: Rectangle = rectangle3.copy();
    command.apply([rectangle1, rectangle2, rectangle3]);
    expect(rectangle3).toEqual(expectedRectangle3);
  });

  it('#cancel should move the selected primitives in the opposite direction' , () => {
    const expectedRectangle1: Rectangle = rectangle1.copy();
    const oppositeTranslation = Point.copyPoint(translation);
    oppositeTranslation.multiply(-1);
    expectedRectangle1.move(oppositeTranslation);
    const expectedRectangle2: Rectangle = rectangle2.copy();
    expectedRectangle2.move(oppositeTranslation);
    command.cancel([rectangle1, rectangle2]);
    expect(rectangle1).toEqual(expectedRectangle1);
    expect(rectangle2).toEqual(expectedRectangle2);
  });

  it('#cancel should not move a primitive that is not selected' , () => {
    const expectedRectangle3: Rectangle = rectangle3.copy();
    command.cancel([rectangle1, rectangle2, rectangle3]);
    expect(rectangle3).toEqual(expectedRectangle3);
  });

});
