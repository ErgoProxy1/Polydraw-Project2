import { Point } from '../../utils/point';
import { DefaultStamps } from '../../utils/stampData';
import { Stamp } from './stamp';

describe('Stamp', () => {
  let stamp: Stamp;

  beforeEach(() => {
    stamp = new Stamp(100, 135, new Point(100, 100), DefaultStamps[1]);
  });

  it('Properly constructed', () => {
    expect(stamp.stampScale).toBe(0.2);
    expect(stamp.angle).toBe(135);
    expect(stamp.position).toEqual(new Point(100, 100));
    expect(stamp.info).toEqual(DefaultStamps[1]);
    expect(stamp.stampTranslation).toBe('translate(100,100) ');
    expect(stamp.stampRotation).toBe('rotate(135) ');
    expect(stamp.scaled).toBe('scale(0.2) ');
    expect(stamp.stampTransformations).toBe('translate(100,100) rotate(135) scale(0.2) ');
    expect(stamp.origin).toBe('0px 0px');
  });

  it('#createCopy correctly copies the stamp', () => {
    const newStamp = Stamp.createCopy(stamp);
    expect(newStamp).toEqual(stamp);
  });
});
