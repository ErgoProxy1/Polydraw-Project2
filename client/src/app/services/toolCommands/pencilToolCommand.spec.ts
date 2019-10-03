import { TestBed } from '@angular/core/testing';
import { Path } from '../svgPrimitives/path/path';
import { Color } from '../utils/color';
import { PencilToolCommand } from './pencilToolCommand';

describe('PaintBrushCommand', () => {
    let pencilToolCmd: PencilToolCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      pencilToolCmd = new PencilToolCommand(new Color(200, 150, 100, 1), 10);
    });

    it('should be properly created', () => {
        expect(pencilToolCmd).toBeTruthy();
        expect(pencilToolCmd.path).not.toBeNull();
      });

    it('#apply should return the current path', () => {
      pencilToolCmd.apply();
      expect(pencilToolCmd.path).not.toBeNull();
      expect(pencilToolCmd.path).toEqual(new Path(new Color(200, 150, 100, 1), 10));

    });

    it('#cancel should cancel  path', () => {
        const currentPath = pencilToolCmd.path;
        pencilToolCmd.cancel();
        expect(pencilToolCmd.path).toEqual(currentPath);
        expect(pencilToolCmd.path).toEqual(new Path(new Color(200, 150, 100, 1), 10));
      });

  });
