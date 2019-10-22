import { Stamp } from '../svgPrimitives/stamp/stamp';
import { Point } from '../utils/point';
import { DefaultStamps } from '../utils/stampData';
import { StampToolCommand } from './stampToolCommand';

describe('StampToolCommand', () => {
    let command: StampToolCommand;
    beforeEach(() => {
        command = new StampToolCommand(100 , 135, new Point(50, 50), DefaultStamps[1]);
    });
    it('Properly constructed', () => {
        expect(command.stamp.scale).toBe(0.2);
        expect(command.stamp.angle).toBe(135);
        expect(command.stamp.position).toEqual(new Point(50, 50));
        expect(command.stamp.info).toEqual(DefaultStamps[1]);
    });

    it('Rotation is correctly handled', () => {
        command.rotate(15);
        expect(command.stamp.angle).toBe(150);
        expect(command.stamp.rotation).toBe('rotate(-150, 100, 100)');
        expect(command.stamp.translation).toBe('translate(50,50)');
        expect(command.stamp.transformations).toBe('translate(50,50)rotate(-150, 100, 100)scale(0.2) ');
    });

    it('Movement is correctly handled', () => {
        command.move(new Point(51, 51));
        expect(command.stamp.position).toEqual(new Point(51, 51));
        expect(command.stamp.rotation).toBe('rotate(-135, 100, 100)');
        expect(command.stamp.translation).toBe('translate(51,51)');
        expect(command.stamp.transformations).toBe('translate(51,51)rotate(-135, 100, 100)scale(0.2) ');
    });

    it('Apply command is properly handled', () => {
        expect(command.apply()).toEqual(new Stamp(100 , 135, new Point(50, 50), DefaultStamps[1]));
    });

    it('Cancel command does nothing', () => {
        expect(command.cancel()).toBeUndefined();
    });
});
