
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ColorApplicatorToolCommand } from './colorApplicatorCommand';

describe('ColorApplicatorToolCommand', () => {
  let colorApplicator: ColorApplicatorToolCommand;
  const primitive = new Rectangle(new Color(200, 240, 190, 1), new Color(190, 200, 100, 1), 10, StrokeType.Full, new Point(0, 0), 100, 50);
  const color = new Color(200, 240, 190, 1);
  const isPrimary = true;

  beforeEach(() => { colorApplicator = new ColorApplicatorToolCommand( primitive, isPrimary, color ); });
  it('#changeColor should change the primitive color', () => {
      const colorOne = new Color(200, 240, 100, 1);
      colorApplicator.changeColor(colorOne);
      expect(colorApplicator.newColor).not.toBe(colorApplicator.lastColor);
});

});
