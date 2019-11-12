import { TestBed } from '@angular/core/testing';
import { Color } from '../../utils/color';
import { MIN_STROKE_WIDTH, PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Pen } from './pen';

describe('Pen', () => {
  let pen: Pen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pen = new Pen(Color.BLACK, MIN_STROKE_WIDTH, PrimitiveType.Paint, Texture.Degraded);

  });

  it('should be properly created', () => {
    expect(pen).toBeTruthy();
    expect(pen.commandSvg.length).toBe(0);
    expect(pen.strokeColor).toEqual(Color.BLACK);
    expect(pen.strokeWidth).toBe(MIN_STROKE_WIDTH);
    expect(pen.texture).toBe(Texture.Degraded);
    expect(pen.type).toBe(PrimitiveType.Paint);
    expect(pen.headPoints.length).toBe(0);
    expect(pen.paths[0][0]).toBe('');
    expect(pen.paths[0][1]).toBe(0);
  });

  it('should have default texture if not specified', () => {
    pen = new Pen(Color.BLACK, PrimitiveType.Paint, MIN_STROKE_WIDTH);
    expect(pen.texture).toBe(Texture.Basic);
  });

  it('should correctly add the first point', () => {
    expect(pen.commandSvg.length).toBe(0);
    pen.addPoint(new Point(10, 20));
    expect(pen.commandSvg).toBe('M10 20 L10 20');
  });

  it('#addPoint should correctly add points after the first one', () => {
    expect(pen.commandSvg.length).toBe(0);
    pen.addPoint(new Point(10, 20));
    pen.addPoint(new Point(30, 40));
    expect(pen.commandSvg).toBe('M10 20 L10 20 L30 40');
    pen.addPoint(new Point(50, 60));
    expect(pen.commandSvg).toBe('M10 20 L10 20 L30 40 L50 60');
  });

  it('#createCopy correctly copies the pen', () => {
    const newPen = Pen.createCopy(pen);
    expect(newPen).toEqual(pen);
  });

  it('#addPath should correctely change the attributes paths and points', () => {
    expect(pen.paths[0][0]).toBe('');
    expect(pen.paths[0][1]).toBe(0);
    pen.addPath(new Point(10, 20), 14);
    pen.addPath(new Point(30, 40), 13);
    pen.addPath(new Point(35, 45), 12);
    pen.addPath(new Point(50, 45), 11);
    pen.addPath(new Point(50, 60), 10);
    expect(pen.paths[0]).toEqual([ '', 0 ]);
    expect(pen.headPoints.length).toBe(2);
    expect(pen.points.length).toBe(5);
    expect(pen.paths[pen.paths.length - 1][0]).toEqual('M50 45 L50 45 L50 60');
    expect(pen.paths[pen.paths.length - 1][1]).toBe(10);
    pen.addPath(new Point(100, 70), 9);
    expect(pen.paths[pen.paths.length - 1][0]).toEqual('M50 60 L50 60 L100 70');
    expect(pen.paths[pen.paths.length - 1][1]).toBe(9);
  });
});
