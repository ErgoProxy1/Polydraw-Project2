import { TestBed } from '@angular/core/testing';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE } from '../utils/constantsAndEnums';
import { SpraypaintToolCommand } from './spraypaintToolCommand';

describe('PaintBrushCommand', () => {
  let spraypaintToolCommand: SpraypaintToolCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    spraypaintToolCommand = new SpraypaintToolCommand(new Color(200, 150, 100, 1),
      DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE);
  });

  it('should be properly created', () => {
    expect(spraypaintToolCommand).toBeTruthy();
    expect(spraypaintToolCommand.spraypaint).not.toBeNull();
  });

  it('#apply should add the current spraypaint to the list of primitives', () => {
    const primitives: SVGPrimitive[] = [];
    spraypaintToolCommand.apply(primitives);
    expect(primitives).toContain(spraypaintToolCommand.spraypaint);
  });

  it('#cancel should remove the current spraypaint from the list of primitives', () => {
    const primitives: SVGPrimitive[] = [spraypaintToolCommand.spraypaint];
    spraypaintToolCommand.cancel(primitives);
    expect(primitives).not.toContain(spraypaintToolCommand.spraypaint);
  });
});
