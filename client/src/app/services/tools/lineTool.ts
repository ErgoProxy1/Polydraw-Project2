import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { LineToolCommand } from '../toolCommands/lineToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import {
  CIRCLE_RADIUS_FACTOR, CROSSHAIR_CURSOR, DEFAULT_LINE_ROUNDING,
  DEFAULT_LINE_STROKE_WIDTH, KeyboardEventType, LineCap, LineJoin, MouseEventType, Pattern, ToolType
} from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class LineTool extends Tool {
  type = ToolType.Line;
  pattern: Pattern = Pattern.FullLine;
  lineJoin: LineJoin = LineJoin.Round;
  lineCap: LineCap = LineCap.Butt;
  strokeWidth: number = DEFAULT_LINE_STROKE_WIDTH;
  circleRadius: number = CIRCLE_RADIUS_FACTOR * DEFAULT_LINE_STROKE_WIDTH;
  lineRounding: number = DEFAULT_LINE_ROUNDING;
  protected strokeColor: Color;
  protected command: LineToolCommand;
  private commandSubject: Subject<LineToolCommand> = new Subject<LineToolCommand>();
  protected isCreatingLine = false;
  protected isShiftDown = false;
  protected isFinish = false;

  constructor(strokeColor: Color) {
    super();
    this.strokeColor = strokeColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    switch (eventType) {
      case MouseEventType.MouseDblClick:
        if (!this.isShiftDown) {
          this.update(position);
          this.isFinish = true;
          this.finish(true);
        } else {
          this.isShiftDown = false;
          this.update(position);
          this.command.line.linePoints += ' Z';
          this.command.line.closePath = true;
          this.finish(true);
        }
        break;
      case MouseEventType.MouseClickLeft:
        this.begin(position);
        this.isFinish = false;
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
      case MouseEventType.MouseLeave:
        if (this.isCreatingLine) {
          this.command.line.addPoint(position);
          this.update(position);
        }
        this.isFinish = true;
        this.finish(true);
        break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    if (eventType === KeyboardEventType.ShiftDown) {
      if (this.isCreatingLine) {
        this.isShiftDown = true;      // On attend que l'usager face son dblClick.
      }
    } else if (eventType === KeyboardEventType.BackspaceDown && !this.isFinish) {
      this.command.line.points.pop();
      if (this.command.line.lineJoin === LineJoin.Point) {
        this.command.line.circlePoints.pop();
      }
      this.command.line.setPath();
    } else if (eventType === KeyboardEventType.EscapeDown && !this.isFinish) {
        const len = this.command.line.points.length;
        this.command.line.update(this.command.line.points[len - 1]);
        this.command.line.points.length = 0;
        if (this.command.line.lineJoin === LineJoin.Point) {
          this.command.line.circlePoints.length = 0;
        }
        this.command.line.setPath();
        this.finish(false);
    }
    this.temporaryPrimitivesAvailable.next();
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.isCreatingLine ? [this.command.line] : [];
  }

  getCursor(): string {
    return CROSSHAIR_CURSOR;
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
    } else {
      this.command.line.addPoint(position);
    }
  }

  protected update(position: Point): void {
    if (this.isCreatingLine && this.command) {
      this.command.line.update(position);
    }
  }

  protected finish(nextCommandAvailable: boolean): void {
    if (this.isCreatingLine) {
      this.isCreatingLine = false;
      if (nextCommandAvailable) {
        this.commandSubject.next(this.command);
      }
    }
  }
}
