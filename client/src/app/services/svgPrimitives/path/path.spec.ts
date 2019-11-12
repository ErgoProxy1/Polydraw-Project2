import { TestBed } from '@angular/core/testing';

import { Color } from '../../utils/color';
import { MIN_STROKE_WIDTH, PrimitiveType, Texture } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Path } from './path';

describe('Path', () => {
  let path: Path;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    path = new Path(Color.BLACK, MIN_STROKE_WIDTH, PrimitiveType.Paint, Texture.Degraded);

  });

  it('should be properly created', () => {
    expect(path).toBeTruthy();
    expect(path.commandSvg.length).toBe(0);
    expect(path.strokeColor).toEqual(Color.BLACK);
    expect(path.strokeWidth).toBe(MIN_STROKE_WIDTH);
    expect(path.texture).toBe(Texture.Degraded);
    expect(path.type).toBe(PrimitiveType.Paint);
  });

  it('should have default texture if not specified', () => {
    path = new Path(Color.BLACK, PrimitiveType.Paint, MIN_STROKE_WIDTH);
    expect(path.texture).toBe(Texture.Basic);
  });

  it('should correctly add the first point', () => {
    expect(path.commandSvg.length).toBe(0);
    path.addPoint(new Point(10, 20));
    expect(path.commandSvg).toBe('M10 20 L10 20');
  });

  it('should correctly add points after the first one', () => {
    expect(path.commandSvg.length).toBe(0);
    path.addPoint(new Point(10, 20));
    path.addPoint(new Point(30, 40));
    expect(path.commandSvg).toBe('M10 20 L10 20 L30 40');
    path.addPoint(new Point(50, 60));
    expect(path.commandSvg).toBe('M10 20 L10 20 L30 40 L50 60');
  });

  it('#createCopy correctly copies the path', () => {
    const newPath = Path.createCopy(path);
    expect(newPath).toEqual(path);
  });
});
