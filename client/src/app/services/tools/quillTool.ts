import { Observable, Subject } from 'rxjs';
import { Quill } from '../svgPrimitives/quill/quill';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { QuillToolCommand } from '../toolCommands/quillToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, NO_CURSOR, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class QuillTool extends Tool {

  TYPE = ToolType.QuillTool;

  quillAngleObservable: Observable<number>;
  private quillAngleSubject = new Subject<number>();
  private command: QuillToolCommand;
  private commandSubject: Subject<QuillToolCommand> = new Subject<QuillToolCommand>();

  angle = 0;
  baseLength = 15;
  rotationRate = 15;
  strokeColor: Color;
  currentPosition: Point;
  oldPosition: Point;

  quillCursor: Quill;
  showCursor = true;

  isDrawing = false;

  constructor(strokeColor: Color) {
    super();
    this.strokeColor = strokeColor;
    this.command = new QuillToolCommand(strokeColor);
    this.quillCursor = new Quill(strokeColor);
    this.quillAngleObservable = this.quillAngleSubject.asObservable();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    this.currentPosition = position;
    this.updateQuillCursor();
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.begin();
        break;
      case MouseEventType.MouseMove:
        this.showCursor = true;
        this.update();
        break;
      case MouseEventType.MouseUpLeft:
        this.finish();
        break;
      case MouseEventType.MouseLeave:
        this.showCursor = false;
        this.finish();
        break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    this.rotationRate = (eventType === KeyboardEventType.AltDown) ? 1 : 15;
    this.temporaryPrimitivesAvailable.next();
  }

  mouseWheelEvent(delta: number): void {
    const oldAngle = this.angle;
    this.angle -= delta * this.rotationRate;
    if (this.angle > 359 || this.angle < -359) { this.angle = 0; }
    if (this.isDrawing) {
      this.command.quill.changeAngle(this.currentPosition, oldAngle, this.angle, this.baseLength);
    }
    this.updateQuillCursor();
    this.sendQuillAngleToProperties();
    this.temporaryPrimitivesAvailable.next();
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    if (this.isDrawing) {
      return [this.command.quill, this.quillCursor];
    } else if (this.showCursor) {
      return [this.quillCursor];
    }
    return [];
  }

  private begin(): void {
    this.oldPosition = this.currentPosition;
    this.command = new QuillToolCommand(this.strokeColor);
    this.command.quill.addPoints(this.currentPosition, this.oldPosition, this.angle, this.baseLength);
    this.isDrawing = true;
  }

  private update(): void {
    if (this.isDrawing) {
      this.command.quill.addPoints(this.currentPosition, this.oldPosition, this.angle, this.baseLength);
      this.oldPosition = this.currentPosition;
    }
  }

  private updateQuillCursor(): void {
    this.quillCursor.calculateLengths(this.angle, this.baseLength);
    const firstPoint: Point = Point.copyPoint(this.currentPosition);
    firstPoint.addXY(this.quillCursor.lengthX, this.quillCursor.lengthY);
    const secondPoint: Point = Point.copyPoint(this.currentPosition);
    secondPoint.addXY(-this.quillCursor.lengthX, -this.quillCursor.lengthY);
    this.quillCursor.linePoints[0] = firstPoint.toString() + secondPoint.toString();
    this.quillCursor.strokeColor = this.strokeColor;
  }

  private finish(): void {
    if (this.isDrawing) {
      this.isDrawing = !this.isDrawing;
      this.commandSubject.next(this.command);
    }
  }

  getCursor(): string {
    return NO_CURSOR;
  }

  private sendQuillAngleToProperties(): void {
    this.quillAngleSubject.next(this.angle);
  }

  standby(): void {
    this.finish();
  }
}
