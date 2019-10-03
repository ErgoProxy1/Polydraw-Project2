import { TestBed } from '@angular/core/testing';

import { Color } from '../../utils/color';
import { MIN_STROKE_WIDTH, PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Rectangle } from './rectangle';

describe('Rectangle', () => {
  let rectangle: Rectangle;
  const origin: Point = new Point(0, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    rectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin, 100, 50);

  });

  it('should be properly created', () => {
    expect(rectangle).toBeTruthy();
    expect(rectangle.fillColor).toEqual(Color.WHITE);
    expect(rectangle.strokeColor).toEqual(Color.BLACK);
    expect(rectangle.strokeWidth).toBe(MIN_STROKE_WIDTH);
    expect(rectangle.strokeType).toBe(StrokeType.FullWithOutline);
    expect(rectangle.position).toEqual(origin);
    expect(rectangle.corner1).toEqual(origin);
    expect(rectangle.corner2).toEqual(new Point(100, 50));
    expect(rectangle.type).toBe(PrimitiveType.Rectangle);
  });

  it('should return the correct absolute width and height when asked', () => {
    expect(rectangle.getAbsoluteWidth()).toEqual(100);
    expect(rectangle.getAbsoluteHeight()).toEqual(50);
    rectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin, -100, -50);
  });

  it('should have width and height equal to 0 if not specified', () => {
    rectangle = new Rectangle(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin);
    expect(rectangle.corner1).toEqual(rectangle.corner2);
    expect(rectangle.getAbsoluteWidth()).toBe(0);
    expect(rectangle.getAbsoluteHeight()).toBe(0);
  });

  it('should correctly update corner1 and corner2 after being resized', () => {
    const corner1: Point = new Point(20, 30);
    const corner2: Point = new Point(40, 50);
    rectangle.resize(corner1, corner2, false);
    expect(rectangle.corner1).toEqual(corner1);
    expect(rectangle.corner2).toEqual(corner2);
  });

  it('should set position as the topleft corner after being resized', () => {
    const topLeft: Point = new Point(20, 30);
    const topRight: Point = new Point(40, 30);
    const bottomLeft: Point = new Point(20, 50);
    const bottomRight: Point = new Point(40, 50);
    rectangle.resize(topLeft, topRight, false);
    expect(rectangle.position).toEqual(topLeft);
    rectangle.resize(topLeft, bottomRight, false);
    expect(rectangle.position).toEqual(topLeft);
    rectangle.resize(topRight, bottomLeft, false);
    expect(rectangle.position).toEqual(topLeft);
    rectangle.resize(bottomRight, topLeft, false);
    expect(rectangle.position).toEqual(topLeft);
  });

  it('should have equal width and height after being resized as square', () => {
    const corner1: Point = new Point(0, 0);
    const corner2: Point = new Point(100, 50);
    rectangle.resize(corner1, corner2, true);
    expect(rectangle.getAbsoluteWidth()).toEqual(rectangle.getAbsoluteHeight());
  });

  it('should correctly update absolute width and height values after being resized', () => {
    const topLeft: Point = new Point(10, 30);
    const topRight: Point = new Point(40, 30);
    const bottomLeft: Point = new Point(10, 50);
    const bottomRight: Point = new Point(40, 50);
    rectangle.resize(topLeft, topRight, false);
    expect(rectangle.getAbsoluteWidth()).toEqual(30);
    expect(rectangle.getAbsoluteHeight()).toEqual(0);
    rectangle.resize(topLeft, bottomRight, false);
    expect(rectangle.getAbsoluteWidth()).toEqual(30);
    expect(rectangle.getAbsoluteHeight()).toEqual(20);
    rectangle.resize(topRight, bottomLeft, false);
    expect(rectangle.getAbsoluteWidth()).toEqual(30);
    expect(rectangle.getAbsoluteHeight()).toEqual(20);
    rectangle.resize(bottomRight, topLeft, false);
    expect(rectangle.getAbsoluteWidth()).toEqual(30);
    expect(rectangle.getAbsoluteHeight()).toEqual(20);
    rectangle.resize(bottomRight, topRight, false);
    expect(rectangle.getAbsoluteWidth()).toEqual(0);
    expect(rectangle.getAbsoluteHeight()).toEqual(20);
  });

});
