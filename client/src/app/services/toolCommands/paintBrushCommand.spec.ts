import { TestBed } from '@angular/core/testing';
import { Path } from '../svgPrimitives/path/path';
import { Color } from '../utils/color';
import { Texture } from '../utils/constantsAndEnums';
import { PaintBrushCommand } from './paintBrushCommand';

describe('PaintBrushCommand', () => {
    let paintBrushCmd: PaintBrushCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      paintBrushCmd = new PaintBrushCommand(new Color(200, 150, 100, 1), 10, Texture.Degraded);
    });

    it('should be properly created', () => {
        expect(paintBrushCmd).toBeTruthy();
        expect(paintBrushCmd.path).not.toBeNull();
      });

    it('#apply should return the current path', () => {
      paintBrushCmd.apply();
      expect(paintBrushCmd.path).not.toBeNull();
      expect(paintBrushCmd.path).toEqual(new Path(new Color(200, 150, 100, 1), 10, Texture.Degraded));

    });

    it('#cancel should cancel  path', () => {
        const currentPath = paintBrushCmd.path;
        paintBrushCmd.cancel();
        expect(paintBrushCmd.path).toEqual(currentPath);
        expect(paintBrushCmd.path).toEqual(new Path(new Color(200, 150, 100, 1), 10, Texture.Degraded));
      });

  });
