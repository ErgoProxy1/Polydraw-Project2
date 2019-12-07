import { Point } from '../../utils/point';
import { DEFAULT_STAMPS } from '../../utils/stampData';
import { Stamp } from './stamp';

// tslint:disable: no-string-literal
describe('Stamp', () => {
  let stamp: Stamp;

  beforeEach(() => {
    stamp = new Stamp(100, 135, new Point(100, 100), DEFAULT_STAMPS[1]);
  });

  it('should modify the scale correctly', () => {
    const nullTranslation = new Point(0, 0);
    const newStamp = Stamp.createCopy(stamp);

    // Scale intact
    newStamp.scale(nullTranslation, 1, 1);
    expect(newStamp.stampScaleX).toEqual(0.2);
    expect(newStamp.stampScaleY).toEqual(0.2);

    // Scales combinés
    newStamp.scale(nullTranslation, 2, 2);
    expect(newStamp.stampScaleX).toEqual(0.4);
    expect(newStamp.stampScaleY).toEqual(0.4);

    // Scales combinés négatifs
    newStamp.scale(nullTranslation, -2, -2);
    expect(newStamp.stampScaleX).toEqual(-0.8);
    expect(newStamp.stampScaleY).toEqual(-0.8);

    // Vérifier si la position est correctement appliquée
    const newStamp2 = new Stamp(100, 135, new Point(2, 2), DEFAULT_STAMPS[1]);
    const expectedPosition = new Point(2, 2);
    newStamp2.scale(nullTranslation, 8, 8);
    expect(newStamp2.position).toEqual(expectedPosition);
  });

  it('Properly constructed', () => {
    expect(stamp.stampScaleX).toBe(0.2);
    expect(stamp.stampScaleY).toBe(0.2);
    expect(stamp.angle).toBe(135);
    expect(stamp.position).toEqual(new Point(100, 100));
    expect(stamp.info).toEqual(DEFAULT_STAMPS[1]);
    expect(stamp.stampTranslation).toBe('translate(100,100) ');
    expect(stamp.stampRotation).toBe('rotate(-135,100,100) ');
    expect(stamp.scaled).toBe('scale(0.2,0.2) ');
    expect(stamp.stampTransformations).toBe('translate(100,100) rotate(-135,100,100) scale(0.2,0.2) ');
    expect(stamp.origin).toBe('0px 0px');
  });

  it('#createCopy correctly copies the stamp', () => {
    const newStamp = Stamp.createCopy(stamp);
    expect(newStamp).toEqual(stamp);
  });

  it('#move should correctly change the position of the stamp', () => {
    const newStamp: Stamp = stamp.copy();
    const translation: Point = new Point(100, 100);
    newStamp.position = new Point(200, 200);
    newStamp.createStampTransformationsStrings();
    stamp.move(translation);
    newStamp['topLeftCorner'] = translation;
    newStamp['bottomRightCorner'] = translation;
    expect(newStamp).toEqual(stamp);
  });
});
