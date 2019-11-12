import { KeyboardService } from '../keyboard/keyboard.service';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, PrimitiveType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { TextTool } from './textTool';

describe('TextTool', () => {
  let textTool: TextTool;

  beforeEach(() => {
    textTool = new TextTool(new Color(0, 0, 0, 1), new KeyboardService());
  });

  it('text is properly begun and finished', () => {
    textTool.typing = false;
    textTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));

    const keyboardServicePropertyName = 'keyboardService';

    expect(textTool[keyboardServicePropertyName].inputFocusedActive).toBe(true);
    expect(textTool.typing).toBe(true);
    expect(textTool.perimeter.position).toEqual(new Point(50, 34));
    expect(textTool.perimeter.getTopLeftCorner()).toEqual(new Point(49, 33));
    expect(textTool.perimeter.getBottomRightCorner()).toEqual(new Point(67, 67));
    expect(textTool.getCommand()).toBeDefined();

    textTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(25, 25));

    expect(textTool[keyboardServicePropertyName].inputFocusedActive).toBe(false);
    expect(textTool.typing).toBe(false);
  });

  it('keyboard events are properly handled', () => {
    textTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));

    spyOn(textTool.getCommand(), 'break');
    spyOn(textTool.getCommand(), 'delete');
    spyOn(textTool.getCommand(), 'updateLinePosition');
    spyOn(textTool.getCommand(), 'type');

    textTool.keyAdded = 'Enter';
    textTool.inputted = true;
    textTool.typing = true;
    textTool.keyboardEvent(KeyboardEventType.KeyDown);
    expect(textTool.getCommand().break).toHaveBeenCalled();

    textTool.keyAdded = 'Backspace';
    textTool.inputted = true;
    textTool.typing = true;
    textTool.keyboardEvent(KeyboardEventType.KeyDown);
    expect(textTool.getCommand().delete).toHaveBeenCalled();

    textTool.keyAdded = 'ArrowUp';
    textTool.inputted = true;
    textTool.typing = true;
    textTool.keyboardEvent(KeyboardEventType.KeyDown);
    expect(textTool.getCommand().updateLinePosition).toHaveBeenCalled();

    textTool.keyAdded = 'A';
    textTool.inputted = true;
    textTool.typing = true;
    textTool.keyboardEvent(KeyboardEventType.KeyDown);
    expect(textTool.getCommand().type).toHaveBeenCalled();
  });

  it('applying text is properly handled', () => {
    textTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
    textTool.typing = true;
    textTool.applyText();
    expect(textTool.typing).toBe(false);
  });

  it('temporary primitives are properly returned', () => {
    textTool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50));
    expect(textTool.getTemporaryPrimitives()[0].type).toBe(PrimitiveType.Text);
    expect(textTool.getTemporaryPrimitives()[1].type).toBe(PrimitiveType.Perimeter);
  });

  it('cursor type is correct', () => {
    expect(textTool.getCursor()).toBe('text');
  });

  it('standby function calls applyText function when the tool is still typing', () => {
    spyOn(textTool, 'applyText');
    textTool.typing = true;
    textTool.standby();
    expect(textTool.applyText).toHaveBeenCalled();
  });

  it('standby function does not call applyText function when the tool is not currently typing', () => {
    spyOn(textTool, 'applyText');
    textTool.typing = false;
    textTool.standby();
    expect(textTool.applyText).not.toHaveBeenCalled();
  });

});
