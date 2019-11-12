import { TestBed } from '@angular/core/testing';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { PenToolCommand } from './penToolCommand';

describe('PaintBrushCommand', () => {
    let penToolCommand: PenToolCommand;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      penToolCommand = new PenToolCommand(new Color(200, 150, 100, 1), 10);
    });

    it('should be properly created', () => {
        expect(penToolCommand).toBeTruthy();
        expect(penToolCommand.path).not.toBeNull();
      });

    it('#apply should add the current path to the list of primitives', () => {
      const primitives: SVGPrimitive[] = [];
      penToolCommand.apply(primitives);
      expect(primitives).toContain(penToolCommand.path);
    });

    it('#cancel should remove the current path from the list of primitives', () => {
      const primitives: SVGPrimitive[] = [penToolCommand.path];
      penToolCommand.cancel(primitives);
      expect(primitives).not.toContain(penToolCommand.path);
    });
  });
