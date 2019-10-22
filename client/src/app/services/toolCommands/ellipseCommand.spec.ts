import { TestBed } from '@angular/core/testing';
import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { EllipseCommand } from './ellipseCommand';

describe('EllipseCommand', () => {
    let ellipseCmd: EllipseCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      ellipseCmd = new EllipseCommand(
                                        new Color(200, 150, 100, 1),
                                        new Color(100, 100, 100, 1),
                                        10,
                                        StrokeType.Full,
                                        new Point(200, 300));
    });

    it('should be properly created', () => {
        expect(ellipseCmd).toBeTruthy();
        expect(ellipseCmd.shape).not.toBeNull();
      });

    it('#apply should return the current ellipse', () => {
      expect(ellipseCmd.apply()).toEqual(new Ellipse(new Color(200, 150, 100, 1),
                                                        new Color(100, 100, 100, 1),
                                                        10,
                                                        StrokeType.Full,
                                                        new Point(200, 300), 0, 0));

    });
  });
