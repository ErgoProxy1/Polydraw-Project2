import { TestBed } from '@angular/core/testing';

import { Color } from '../../utils/color';
import { MIN_STROKE_WIDTH, PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Ellipse } from './ellispe';

describe('Ellipse', () => {
  let ellipse: Ellipse;
  const origin: Point = new Point(0, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    ellipse = new Ellipse(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin, 50, 25);
  });

  it('should be properly created', () => {
    expect(ellipse).toBeTruthy();
    expect(ellipse.fillColor).toEqual(Color.WHITE);
    expect(ellipse.strokeColor).toEqual(Color.BLACK);
    expect(ellipse.strokeWidth).toBe(MIN_STROKE_WIDTH);
    expect(ellipse.strokeType).toBe(StrokeType.FullWithOutline);
    expect(ellipse.getAbsoluteWidth()).toEqual(100);
    expect(ellipse.getAbsoluteHeight()).toEqual(50);
    expect(ellipse.type).toBe(PrimitiveType.Ellipse);
  });

  it('should return the correct absolute width and height when asked', () => {
    expect(ellipse.getAbsoluteWidth()).toEqual(100);
    expect(ellipse.getAbsoluteHeight()).toEqual(50);
  });

  it('should have width and height equal to 0 if not specified', () => {
    ellipse = new Ellipse(Color.WHITE, Color.BLACK, MIN_STROKE_WIDTH, StrokeType.FullWithOutline, origin);
    expect(ellipse.getAbsoluteWidth()).toBe(0);
    expect(ellipse.getAbsoluteHeight()).toBe(0);
  });

  it('should correctly update center position after being resized', () => {
    const corner1: Point = new Point(20, 30);
    const corner2: Point = new Point(40, 50);
    const expectedCenter: Point = new Point(30, 40);
    ellipse.resize(corner1, corner2, false);
    expect(ellipse.getCenter()).toEqual(expectedCenter);
  });

  it('should have equal width and height after being resized as circle', () => {
    const corner1: Point = new Point(0, 0);
    const corner2: Point = new Point(100, 50);
    ellipse.resize(corner1, corner2, true);
    expect(ellipse.getAbsoluteWidth()).toEqual(ellipse.getAbsoluteHeight());
  });

  it('should correctly update absolute width and height values after being resized', () => {
    const topLeft: Point = new Point(10, 30);
    const topRight: Point = new Point(40, 30);
    const bottomLeft: Point = new Point(10, 50);
    const bottomRight: Point = new Point(40, 50);
    ellipse.resize(topLeft, topRight, false);
    expect(ellipse.getAbsoluteWidth()).toEqual(30);
    expect(ellipse.getAbsoluteHeight()).toEqual(0);
    ellipse.resize(topLeft, bottomRight, false);
    expect(ellipse.getAbsoluteWidth()).toEqual(30);
    expect(ellipse.getAbsoluteHeight()).toEqual(20);
    ellipse.resize(topRight, bottomLeft, false);
    expect(ellipse.getAbsoluteWidth()).toEqual(30);
    expect(ellipse.getAbsoluteHeight()).toEqual(20);
    ellipse.resize(bottomRight, topLeft, false);
    expect(ellipse.getAbsoluteWidth()).toEqual(30);
    expect(ellipse.getAbsoluteHeight()).toEqual(20);
    ellipse.resize(bottomRight, topRight, false);
    expect(ellipse.getAbsoluteWidth()).toEqual(0);
    expect(ellipse.getAbsoluteHeight()).toEqual(20);
  });

  it('#createCopy correctly copies the ellipse', () => {
    const newEllipse = Ellipse.createCopy(ellipse);
    expect(newEllipse).toEqual(ellipse);
  });

});
