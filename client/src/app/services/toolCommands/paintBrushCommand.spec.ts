import { TestBed } from '@angular/core/testing';
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

    it('#apply should add the current path to the list of primitives', () => {
        const primitives: SVGPrimitive[] = [];
        paintBrushCmd.apply(primitives);
        expect(primitives).toContain(paintBrushCmd.path);
      });

    it('#cancel should remove the current path from the list of primitives', () => {
        const primitives: SVGPrimitive[] = [paintBrushCmd.path];
        paintBrushCmd.cancel(primitives);
        expect(primitives).not.toContain(paintBrushCmd.path);
      });
  });
