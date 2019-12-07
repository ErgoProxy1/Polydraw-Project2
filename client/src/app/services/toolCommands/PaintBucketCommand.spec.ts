import { TestBed } from '@angular/core/testing';
import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { PaintBucketCommand } from './PaintBucketCommand';

describe('PaintBucketCommand', () => {
    let paintBucketCommand: PaintBucketCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        const primitive = new FillingPath(new Color(255, 0, 0), new Color(0, 255, 0), 3, PrimitiveType.Fill, StrokeType.FullWithOutline);
        paintBucketCommand = new PaintBucketCommand(primitive);
    });

    it('should be properly created', () => {
        expect(paintBucketCommand).toBeTruthy();
        expect(paintBucketCommand.shapeToDraw).not.toBeNull();
    });

    it('#apply should add the current path to the list of primitives', () => {
        const primitives: SVGPrimitive[] = [];
        paintBucketCommand.apply(primitives);
        expect(primitives).toContain(paintBucketCommand.shapeToDraw);
    });

    it('#cancel should remove the current path from the list of primitives', () => {
        const primitives: SVGPrimitive[] = [paintBucketCommand.shapeToDraw];
        paintBucketCommand.cancel(primitives);
        expect(primitives).not.toContain(paintBucketCommand.shapeToDraw);
    });
});
