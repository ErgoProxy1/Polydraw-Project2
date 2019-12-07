import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { DEFAULT_STAMPS } from '../utils/stampData';
import { StampToolCommand } from './stampToolCommand';

describe('StampToolCommand', () => {
    let command: StampToolCommand;
    beforeEach(() => {
        command = new StampToolCommand(100 , 135, new Point(50, 50), DEFAULT_STAMPS[1]);
    });
    it('Properly constructed', () => {
        expect(command.stamp.stampScaleX).toBe(0.2);
        expect(command.stamp.stampScaleY).toBe(0.2);
        expect(command.stamp.angle).toBe(135);
        expect(command.stamp.position).toEqual(new Point(50, 50));
        expect(command.stamp.info).toEqual(DEFAULT_STAMPS[1]);
    });

    it('Rotation is correctly handled', () => {
        command.rotate(15);
        expect(command.stamp.angle).toBe(150);
        expect(command.stamp.stampRotation).toBe('rotate(-150,100,100) ');
        expect(command.stamp.stampTranslation).toBe('translate(50,50) ');
        expect(command.stamp.stampTransformations).toBe('translate(50,50) rotate(-150,100,100) scale(0.2,0.2) ');
    });

    it('Movement is correctly handled', () => {
        command.move(new Point(51, 51));
        expect(command.stamp.position).toEqual(new Point(51, 51));
        expect(command.stamp.stampRotation).toBe('rotate(-135,100,100) ');
        expect(command.stamp.stampTranslation).toBe('translate(51,51) ');
        expect(command.stamp.stampTransformations).toBe('translate(51,51) rotate(-135,100,100) scale(0.2,0.2) ');
    });

    it('Apply command is properly handled', () => {
        const primitives: SVGPrimitive[] = [];
        command.apply(primitives);
        expect(primitives).toContain(command.stamp);
    });

    it('Cancel command is properly handled', () => {
        const primitives: SVGPrimitive[] = [command.stamp];
        command.cancel(primitives);
        expect(primitives).not.toContain(command.stamp);
    });
});
