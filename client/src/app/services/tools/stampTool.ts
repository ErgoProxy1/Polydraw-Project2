import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { StampToolCommand } from '../toolCommands/stampToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { ALT_KEY_CODE, KeyboardEventType, MouseEventType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DefaultStamps, StampInfo } from '../utils/stampData';
import { Tool } from './tool';

export class StampTool implements Tool {
  readonly INIT_ANGLE: number = 0;
  readonly INIT_SCALE: number = 100;
  readonly STAMPS: StampInfo[] = DefaultStamps;

  type = ToolType.StampTool;

  angleObservable: Observable<number>;
  angleSubject = new Subject<number>();

  private command: StampToolCommand;
  private stampSelected = false;
  private commandReady = false;
  initialPosition: Point;
  rotationRate = 15;
  scale: number;
  angle: number;
  selected = 0;
  position: Point;

  constructor() {
    this.angle = this.INIT_ANGLE;
    this.scale = this.INIT_SCALE;
    this.angleObservable = this.angleSubject.asObservable();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
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
      }
      return this.stampSelected ? [this.command.stamp] : [];
    } else {
      return [];
    }
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    if (this.selected !== 0) {
      if (eventType === KeyboardEventType.KeyDown && key === ALT_KEY_CODE) {
        this.rotationRate = 1;
      } else {
        this.rotationRate = 15;
      }
      return this.stampSelected ? [this.command.stamp] : [];
    }
    return [];
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
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
      return [this.command.stamp];
    }
    return [];
  }

  isCommandReady(): boolean {
    return this.commandReady;
  }

  getCommand(): ToolCommand {
    this.commandReady = false;
    return this.command;
  }

  private begin(): void {
    this.initialPosition = this.position;
    this.command = new StampToolCommand(
      this.scale, this.angle + this.STAMPS[this.selected].initRotation, this.initialPosition, this.STAMPS[this.selected],
    );
    this.stampSelected = true;
    this.commandReady = false;
  }

  private update(): void {
    if (this.stampSelected) {
      this.command.move(this.position);
    }
  }

  private finish(): void {
    if (this.stampSelected) {
      this.stampSelected = false;
      this.commandReady = true;
    }
  }

  sendAngleToStampProperties(angle: number): void {
    this.angleSubject.next(angle);
  }
}
