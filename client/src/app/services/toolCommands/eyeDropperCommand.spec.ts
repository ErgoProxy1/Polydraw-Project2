import { TestBed } from '@angular/core/testing';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { EyeDropperToolCommand } from './eyeDropperCommand';

describe('EyeDropperCommand', () => {
    const primitive = new Rectangle(new Color(200, 240, 190, 1),
    new Color(190, 200, 100, 1), 10,
    StrokeType.Full, new Point(0, 0), 100, 50);

    let eyeDropperCommand: EyeDropperToolCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      eyeDropperCommand = new EyeDropperToolCommand(primitive, true, new Color(128, 64, 32, 0.5));
    });

    it('should be properly created', () => {
        expect(eyeDropperCommand).toBeTruthy();
        expect(eyeDropperCommand.primitive).not.toBeNull();
        expect(eyeDropperCommand.isPrimary).not.toBeNull();
        expect(eyeDropperCommand.newColor).not.toBeNull();
      });

    it('#apply should return null', () => {
      expect(eyeDropperCommand.apply()).toBeNull();
      expect(eyeDropperCommand.apply()).not.toBeUndefined();
    });

    it('#cancel should do nothing', () => {
        expect(eyeDropperCommand.cancel()).not.toBeNull();
        expect(eyeDropperCommand.cancel()).toBeUndefined();
    });

  });
