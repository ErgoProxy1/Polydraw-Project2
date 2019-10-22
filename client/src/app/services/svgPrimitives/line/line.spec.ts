import { TestBed } from '@angular/core/testing';
import { Color } from '../../utils/color';
import { CIRCLE_RADIUS_FACTOR, DEFAULT_LINE_ROUNDING, LineCap,
  LineJoin, MIN_STROKE_WIDTH, Pattern, PrimitiveType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Line } from './line';

describe('Line', () => {
  let line: Line;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    line = new Line(Color.BLACK, MIN_STROKE_WIDTH, Pattern.FullLine, LineJoin.Miter,
      LineCap.Round, CIRCLE_RADIUS_FACTOR * MIN_STROKE_WIDTH, DEFAULT_LINE_ROUNDING);

  });

  it('should be properly created', () => {
    expect(line).toBeTruthy();
    expect(line.points.length).toBe(0);
    expect(line.strokeColor).toEqual(Color.BLACK);
    expect(line.strokeWidth).toBe(MIN_STROKE_WIDTH);
    expect(line.pattern).toBe(Pattern.FullLine);
    expect(line.lineJoin).toBe(LineJoin.Miter);
    expect(line.type).toBe(PrimitiveType.Line);
    expect(line.lineCap).toBe(LineCap.Round);
    expect(line.circleRadius).toBe(CIRCLE_RADIUS_FACTOR * MIN_STROKE_WIDTH);
    expect(line.linePoints).toEqual('');
    expect(line.circlePoints).toEqual([]);
  });

  it('#addPoint should add a new point to the array attribute points', () => {
    const point: Point = new Point(100, 150);
    const len = line.points.length;
    line.addPoint(point);
    expect(line.points.length).toBe(len + 1);
    expect(line.points[len]).toEqual(point);
  });

  it('#setPath should set properly linePoints when the attribute points has a new point', () => {
    const point: Point = new Point(100, 150);
    const secondPoint: Point = new Point(200, 90);
    expect(line.linePoints).toBe('');
    line.addPoint(point);
    line.tempPoint = new Point(20, 25);
    line.setPath();
    expect(line.linePoints).toBe(`M${point.x} ${point.y} L${line.tempPoint.x} ${line.tempPoint.y}`);
    line.addPoint(secondPoint);
    line.setPath();
    expect(line.linePoints).toBe(`M${point.x} ${point.y} L${secondPoint.x} ${secondPoint.y} L${line.tempPoint.x} ${line.tempPoint.y}`);
  });

  it('#update should setup properly the linePoints and tempPoint attribute ', () => {
    const point: Point = new Point(100, 150);
    const secondPoint: Point = new Point(200, 90);
    expect(line.linePoints).toBe('');
    line.addPoint(point);
    line.update(point);
    expect(line.tempPoint).toEqual(point);
    expect(line.linePoints).toBe(`M${point.x} ${point.y} L${point.x} ${point.y}`);
    line.update(secondPoint);
    expect(line.tempPoint).toEqual(secondPoint);
    expect(line.linePoints).toBe(`M${point.x} ${point.y} L${secondPoint.x} ${secondPoint.y}`);
  });

  it('#createCopy correctly copies the line', () => {
    line.addPoint(new Point(0, 0));
    const newLine = Line.createCopy(line);
    expect(newLine).toEqual(line);
  });

});
