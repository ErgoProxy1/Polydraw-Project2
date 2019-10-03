import { TestBed } from '@angular/core/testing';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { RectangleCommand } from './rectangleCommand';

describe('PaintBrushCommand', () => {
    let rectangleCmd: RectangleCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      rectangleCmd = new RectangleCommand(
                                        new Color(200, 150, 100, 1),
                                        new Color(100, 100, 100, 1),
                                        10,
                                        StrokeType.Full,
                                        new Point(200, 300));
    });

    it('should be properly created', () => {
        expect(rectangleCmd).toBeTruthy();
        expect(rectangleCmd.shape).not.toBeNull();
      });

    it('#apply should return the current path', () => {
      rectangleCmd.apply();
      expect(rectangleCmd.shape).toEqual(new Rectangle(new Color(200, 150, 100, 1),
                                                        new Color(100, 100, 100, 1),
                                                        10,
                                                        StrokeType.Full,
                                                        new Point(200, 300), 0, 0));

    });

    it('#cancel should cancel  path', () => {
        const currentRect = rectangleCmd.shape;
        rectangleCmd.cancel();
        expect(rectangleCmd.shape).toEqual(currentRect);
        expect(rectangleCmd.shape).toEqual(new Rectangle(new Color(200, 150, 100, 1),
                                                        new Color(100, 100, 100, 1),
                                                        10,
                                                        StrokeType.Full,
                                                        new Point(200, 300), 0, 0));
      });
  });
