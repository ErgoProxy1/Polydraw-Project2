import { TestBed } from '@angular/core/testing';
import { Path } from '../svgPrimitives/path/path';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
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
      const path: SVGPrimitive | null = pencilToolCmd.apply();
      expect(path).not.toBeNull();
      expect(path).toEqual(new Path(new Color(200, 150, 100, 1), 10));

    });

  });
