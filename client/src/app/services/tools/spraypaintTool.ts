import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { SpraypaintToolCommand } from '../toolCommands/spraypaintToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { MouseEventType, ToolType} from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class SpraypaintTool extends Tool {

  strokeColor: Color;
  paintDelay: number;
  range: number;
  isDrawing = false;
  timerIds: number[] = [];
  readonly TYPE = ToolType.SpraypaintTool;

  private command: SpraypaintToolCommand;
  private commandSubject: Subject<SpraypaintToolCommand> = new Subject<SpraypaintToolCommand>();

  constructor(strokeColor: Color, paintDelay: number, range: number) {
    super();
    this.strokeColor = strokeColor;
    this.paintDelay = paintDelay;
    this.range = range;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.begin();
        this.command.spraypaint.spray(position);
        this.setSpray(position);
        break;
      case MouseEventType.MouseMove:
        if (this.command && this.isDrawing) {
          this.command.spraypaint.spray(position);
          this.clearSpray();
          this.setSpray(position);
        }
        break;
      case MouseEventType.MouseUpLeft:
        this.clearSpray();
        this.finish();
        break;
      case MouseEventType.MouseLeave:
        this.clearSpray();
        this.finish();
        break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    if (this.isDrawing) {
      return [this.command.spraypaint];
    }
    return [];
  }

  protected begin(): void {
    if (!this.isDrawing) {
      this.command = new SpraypaintToolCommand(this.strokeColor, this.paintDelay, this.range);
      this.isDrawing = true;
    }
  }

  clearSpray(): void {
    if (this.timerIds.length > 0) {
      this.timerIds.forEach((tim) => {
        clearInterval(tim);
      });
    }
  }

  /**
   * Cette méthode permet d'envoyer à interval régulier un flux de points.
   * @param position La position courante du curseur.
   */
  setSpray(position: Point): void {
    if (this.command && this.isDrawing) {
      const timerId = setInterval(() => {
        this.command.spraypaint.spray(position);
      }, this.command.spraypaint.paintDelay);
      this.timerIds.push((timerId as unknown) as number);
    }
  }

  finish(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.commandSubject.next(this.command);
    }
  }

  standby(): void {
    this.finish();
  }
}
