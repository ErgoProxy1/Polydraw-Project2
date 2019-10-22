import { TestBed } from '@angular/core/testing';
import { Path } from '../svgPrimitives/path/path';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
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
      const path: SVGPrimitive | null = paintBrushCmd.apply();
      expect(path).not.toBeNull();
      expect(path).toEqual(new Path(new Color(200, 150, 100, 1), 10, Texture.Degraded));

    });

  });
