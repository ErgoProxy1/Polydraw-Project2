import { Point } from './point';

describe('Point', () => {

  it('#addPoint should return a new point that is the sum of this point and the other', () => {
    const point1: Point = new Point(10, 20);
    const point2: Point = new Point(30, 40);
    const expectedSum: Point = new Point(40, 60);
    expect(point1.addPoint(point2)).toEqual(expectedSum);
  });

  it('#addXY should return a new point of which the coordinates are the sum of this point\'s coordinates and the other\'s', () => {
    const point: Point = new Point(10, 20);
    const expectedSum: Point = new Point(-20, -20);
    expect(point.addXY(-30, -40)).toEqual(expectedSum);
  });

  it('#copyPoint should return a new point that is the same as the other', () => {
    const point: Point = new Point(10, 20);
    expect(Point.copyPoint(point)).toEqual(point);
  });
});
