import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { StampToolCommand } from '../toolCommands/stampToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { DEFAULT_CURSOR, KeyboardEventType, MouseEventType, NO_CURSOR, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DEFAULT_STAMPS, StampInfo } from '../utils/stampData';
import { Tool } from './tool';

export class StampTool extends Tool {
  readonly INIT_ANGLE: number = 0;
  readonly INIT_SCALE: number = 100;
  readonly STAMPS: StampInfo[] = DEFAULT_STAMPS;

  TYPE = ToolType.StampTool;

  angleObservable: Observable<number>;
  private angleSubject = new Subject<number>();

  private command: StampToolCommand;
  private commandSubject: Subject<StampToolCommand> = new Subject<StampToolCommand>();
  private stampSelected = false;
  initialPosition: Point;
  rotationRate = 15;
  scale: number;
  angle: number;
  selected = 0;
  position: Point;

  constructor() {
    super();
    this.angle = this.INIT_ANGLE;
    this.scale = this.INIT_SCALE;
    this.angleObservable = this.angleSubject.asObservable();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    this.position = position;
    if (this.selected !== 0) {
      switch (eventType) {
        case MouseEventType.MouseMove:
          this.begin();
          this.update();
          break;
        case MouseEventType.MouseDownLeft:
          this.update();
          this.finish();
          break;
        case MouseEventType.MouseLeave:
          this.stampSelected = false;
      }
      this.temporaryPrimitivesAvailable.next();
    }
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    if (this.selected !== 0) {
      if (eventType === KeyboardEventType.AltDown) {
        this.rotationRate = 1;
      } else {
        this.rotationRate = 15;
      }
      this.temporaryPrimitivesAvailable.next();
    }
  }

  mouseWheelEvent(delta: number): void {
    if (this.selected !== 0) {
      this.begin();
      if (delta === -1) {
        this.angle = this.angle + this.rotationRate;
        this.command.rotate(this.rotationRate);
        this.sendAngleToStampProperties(this.angle);
      } else {
        this.angle = this.angle - this.rotationRate;
        this.command.rotate(-this.rotationRate);
        this.sendAngleToStampProperties(this.angle);
      }
      if (this.angle > 359 || this.angle < -359) { this.angle = 0; }
      this.update();
      this.temporaryPrimitivesAvailable.next();
    }
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.selected !== 0 && this.stampSelected ? [this.command.stamp] : [];
  }

  getCursor(): string {
    return this.selected ? NO_CURSOR : DEFAULT_CURSOR;
  }

  private begin(): void {
    this.initialPosition = this.position;
    this.command = new StampToolCommand(
      this.scale, this.angle + this.STAMPS[this.selected].initRotation, this.initialPosition, this.STAMPS[this.selected],
    );
    this.stampSelected = true;
  }

  private update(): void {
    if (this.stampSelected) {
      this.command.move(this.position);
    }
  }

  private finish(): void {
    if (this.stampSelected) {
      this.stampSelected = false;
      this.commandSubject.next(this.command);
    }
  }

  private sendAngleToStampProperties(angle: number): void {
    this.angleSubject.next(angle);
  }

  standby(): void {
    this.stampSelected = false;
  }
}
