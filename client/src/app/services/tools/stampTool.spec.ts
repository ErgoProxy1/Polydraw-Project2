import { StampToolCommand } from '../toolCommands/stampToolCommand';
import { KeyboardEventType, MouseEventType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { StampTool } from './stampTool';

describe('StampTool', () => {
    let tool: StampTool = new StampTool();

    it('is properly constructed', () => {
        tool = new StampTool();
        expect(tool.angle).toBe(0);
        expect(tool.scale).toBe(100);
    });

    it('Keyboard event is properly handled', () => {
        expect(tool.rotationRate).toBe(15);

        tool.selected = 1;
        tool.keyboardEvent(KeyboardEventType.KeyDown, 'Alt');
        expect(tool.rotationRate).toBe(1);

        tool.selected = 1;
        tool.keyboardEvent(KeyboardEventType.KeyUp, 'Alt');
        expect(tool.rotationRate).toBe(15);
    });

    it('Wheel event is properly handled', () => {
        tool.position = new Point(50, 50);

        tool.angle = 0;
        tool.selected = 1;
        tool.mouseWheelEvent(-1);
        expect(tool.angle).toBe((15));
        expect((tool.getCommand() as StampToolCommand).stamp.angle).toBe(15);

        tool.angle = 0;
        tool.selected = 1;
        tool.mouseWheelEvent(1);
        expect(tool.angle).toBe((-15));
        expect((tool.getCommand() as StampToolCommand).stamp.angle).toBe(-15);

        tool.angle = 359;
        tool.selected = 1;
        tool.mouseWheelEvent(-1);
        expect(tool.angle).toBe((0));
        expect((tool.getCommand() as StampToolCommand).stamp.angle).toBe(374);

        tool.angle = -359;
        tool.selected = 1;
        tool.mouseWheelEvent(1);
        expect(tool.angle).toBe((0));
        expect((tool.getCommand() as StampToolCommand).stamp.angle).toBe(-374);

        tool.selected = 0;
        expect(tool.mouseWheelEvent(1)).toEqual([]);
    });

    it('Properly detects if command is ready', () => {
        tool.selected = 1;

        tool.mouseEvent(MouseEventType.MouseMove, new Point(50, 50));
        expect(tool.isCommandReady()).toBe(false);

        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(51, 51));
        expect(tool.isCommandReady()).toBe(true);
    });

    it('Command is properly handled', () => {
        tool.selected = 1;
        tool.mouseEvent(MouseEventType.MouseMove, new Point(50, 50));
        const command: StampToolCommand = (tool.getCommand() as StampToolCommand);
        expect(command.stamp.angle).toBe(0);
        expect(command.stamp.info.name).toBe('Ancre');
        expect(command.stamp.position).toEqual(new Point(50, 50));
        expect(command.stamp.scale).toBe(0.2);
    });
});
