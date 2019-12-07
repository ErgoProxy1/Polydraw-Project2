import { StampToolCommand } from '../toolCommands/stampToolCommand';
import { KeyboardEventType, MouseEventType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { StampTool } from './stampTool';

describe('StampTool', () => {
  let tool: StampTool = new StampTool();
  const commandAttributeName = 'command';

  it('is properly constructed', () => {
    tool = new StampTool();
    expect(tool.angle).toBe(0);
    expect(tool.scale).toBe(100);
  });

  it('Keyboard event is properly handled', () => {
    expect(tool.rotationRate).toBe(15);

    tool.selected = 1;
    tool.keyboardEvent(KeyboardEventType.AltDown);
    expect(tool.rotationRate).toBe(1);

    tool.selected = 1;
    tool.keyboardEvent(KeyboardEventType.AltUp);
    expect(tool.rotationRate).toBe(15);
  });

  it('Wheel event is properly handled', () => {
    tool.position = new Point(50, 50);

    tool.angle = 0;
    tool.selected = 1;
    tool.mouseWheelEvent(-1);
    expect(tool.angle).toBe((15));
    expect(tool[commandAttributeName].stamp.angle).toBe(15);

    tool.angle = 0;
    tool.selected = 1;
    tool.mouseWheelEvent(1);
    expect(tool.angle).toBe((-15));
    expect(tool[commandAttributeName].stamp.angle).toBe(-15);

    tool.angle = 359;
    tool.selected = 1;
    tool.mouseWheelEvent(-1);
    expect(tool.angle).toBe((0));
    expect(tool[commandAttributeName].stamp.angle).toBe(374);

    tool.angle = -359;
    tool.selected = 1;
    tool.mouseWheelEvent(1);
    expect(tool.angle).toBe((0));
    expect(tool[commandAttributeName].stamp.angle).toBe(-374);

    tool.selected = 0;
    tool.mouseWheelEvent(1);
    expect(tool.getTemporaryPrimitives()).toEqual([]);
  });

  it('Command is properly handled', () => {
    tool.selected = 1;
    tool.mouseEvent(MouseEventType.MouseMove, new Point(50, 50));
    const command: StampToolCommand = tool[commandAttributeName];
    expect(command.stamp.angle).toBe(0);
    expect(command.stamp.info.name).toBe('Ancre');
    expect(command.stamp.position).toEqual(new Point(50, 50));
    expect(command.stamp.stampScaleX).toBe(0.2);
    expect(command.stamp.stampScaleY).toBe(0.2);
  });
});
