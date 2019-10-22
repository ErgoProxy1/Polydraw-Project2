import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { LineToolCommand } from '../toolCommands/lineToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { BACKSPACE_KEY_CODE, CIRCLE_RADIUS_FACTOR, DEFAULT_LINE_ROUNDING, DEFAULT_LINE_STROKE_WIDTH,
  ESCAPE_KEY_CODE, KeyboardEventType, LineCap, LineJoin, MouseEventType,
    Pattern, SHIFT_KEY_CODE, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class LineTool implements Tool {
  type = ToolType.Line;
  pattern: Pattern = Pattern.FullLine;
  lineJoin: LineJoin = LineJoin.Round;
  lineCap: LineCap = LineCap.Butt;
  strokeWidth: number = DEFAULT_LINE_STROKE_WIDTH;
  circleRadius: number = CIRCLE_RADIUS_FACTOR * DEFAULT_LINE_STROKE_WIDTH ;
  lineRounding: number = DEFAULT_LINE_ROUNDING;
  protected strokeColor: Color;
  protected command: LineToolCommand;
  protected isCreatingLine = false;
  protected isShiftDown = false;
  protected commandReady = false;

  constructor(strokeColor: Color) {
    this.strokeColor = strokeColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
    switch (eventType) {
        case MouseEventType.MouseDblClick:
            if (!this.isShiftDown) {
                this.update(position);
                this.finish();
            } else {
                this.isShiftDown = false;
                this.update(position);
                this.command.line.linePoints += ' Z';
                this.finish();
            }
            break;
        case MouseEventType.MouseClickLeft:
            this.begin(position);
            if (this.command.line.lineJoin === LineJoin.Point) {
              this.command.line.circlePoints.push(position);
            }
            break;
        case MouseEventType.MouseDownLeft:
            this.update(position);
            break;
        case MouseEventType.MouseMove:
            this.update(position);
            break;
    }
    return this.isCreatingLine ?  [this.command.line] : [];
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    if (key === SHIFT_KEY_CODE && eventType === KeyboardEventType.KeyDown) {
        if (this.isCreatingLine) {
            this.isShiftDown = true;        // On attend que l'usager face son dblClick.
        }
    } else if (key === ESCAPE_KEY_CODE && eventType === KeyboardEventType.KeyDown) {
        const len = this.command.line.points.length;
        this.command.line.update( this.command.line.points[len - 1 ]);
        this.finish();
    } else if (key === BACKSPACE_KEY_CODE && eventType === KeyboardEventType.KeyDown) {
        const len = this.command.line.points.length;
        this.command.line.update( this.command.line.points[len - 1 ]);
        this.command.line.points.pop();
        this.command.line.setPath();
        this.finish();
    } else if (key === SHIFT_KEY_CODE && eventType === KeyboardEventType.KeyUp) {
      this.isShiftDown = false;
    }
    return this.isCreatingLine ?  [this.command.line] : [];
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return [];
  }

  isCommandReady(): boolean {
    return this.commandReady;
  }

  getCommand(): ToolCommand {
    this.commandReady = false;
    return this.command;
  }

  protected begin(position: Point): void {
    if (!this.isCreatingLine) {
      this.command = new LineToolCommand(this.strokeColor,
                                          this.strokeWidth,
                                          this.pattern,
                                          this.lineJoin,
                                          this.lineCap,
                                          this.circleRadius,
                                          this.lineRounding,
                                          );
      this.command.line.addPoint(position);
      this.isCreatingLine = true;
      this.commandReady = false;
    } else {
      this.command.line.addPoint(position);
    }
  }

  protected update(position: Point): void {
    if (this.isCreatingLine && this.command) {
      this.command.line.update(position);
    }
  }

  protected finish(): void {
    if (this.isCreatingLine) {
      this.isCreatingLine = false;
      this.commandReady = true;
    }
  }
}
