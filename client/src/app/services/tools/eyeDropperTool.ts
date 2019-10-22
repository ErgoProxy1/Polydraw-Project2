import { Observable, Subject } from 'rxjs';
import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Shape } from '../svgPrimitives/shape/shape';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { EyeDropperToolCommand } from '../toolCommands/eyeDropperCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, PrimitiveType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class EyeDropperTool implements Tool {
  type = ToolType.EyeDropper;
  private command: EyeDropperToolCommand;
  private commandReady = false;

  eyeDropperPrimaryObservable: Observable<Color>;
  eyeDropperPrimarySubject = new Subject<Color>();

  eyeDropperSecondaryObservable: Observable<Color>;
  eyeDropperSecondarySubject = new Subject<Color>();

  constructor() {
    this.eyeDropperPrimaryObservable = this.eyeDropperPrimarySubject.asObservable();
    this.eyeDropperSecondaryObservable = this.eyeDropperSecondarySubject.asObservable();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
    if (primitive && (eventType === MouseEventType.MouseDownLeft || eventType === MouseEventType.MouseDownRight)) {
      this.createCommand(eventType === MouseEventType.MouseDownLeft, position, primitive);
    }
    return [];
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return [];
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

  private createCommand(isPrimary: boolean, position: Point, primitive: SVGPrimitive): void {
    const color: Color = this.determineFillOrStroke(position, primitive);
    this.command = new EyeDropperToolCommand(primitive, isPrimary, color);
    isPrimary ? this.sendPrimaryToProperties() : this.sendSecondaryToProperties();
    this.commandReady = true;
  }

  determineFillOrStroke(position: Point, primitive: SVGPrimitive): Color {
    if (primitive.type !== PrimitiveType.Path) {
      if (primitive.type === PrimitiveType.Rectangle) {
        return this.getColorRectangle(position, primitive);
      } else if (primitive.type === PrimitiveType.Ellipse) {
        return this.getColorEllipse(position, primitive);
      } else if (primitive.type === PrimitiveType.Polygon) {
        return this.getColorPolygon(position, primitive);
      } else if (primitive.type === PrimitiveType.Stamp) {
        return (primitive as Stamp).info.color;
      } else if (primitive.type === PrimitiveType.Line) {
        return (primitive as Line).strokeColor;
      }
      return (primitive as Shape).fillColor;
    } else {
      return (primitive as Path).strokeColor;
    }
  }

  getColorRectangle(position: Point, primitive: SVGPrimitive): Color {
    const rectangle = primitive as Rectangle;
    if (position.x >= (rectangle.corner1.x + rectangle.strokeWidth / 2)
      && position.y >= (rectangle.corner1.y + rectangle.strokeWidth / 2)
      && position.x <= (rectangle.corner2.x - rectangle.strokeWidth / 2)
      && position.y <= (rectangle.corner2.y - rectangle.strokeWidth / 2)) {
      return rectangle.fillColor;
    }
    return rectangle.strokeColor;
  }

  getColorEllipse(position: Point, primitive: SVGPrimitive): Color {
    const ellipse = primitive as Ellipse;
    const innerPositionRatio =
      Math.pow(position.x - ellipse.center.x, 2) / Math.pow(ellipse.radiusX - ellipse.strokeWidth / 2, 2) +
      Math.pow(position.y - ellipse.center.y, 2) / Math.pow(ellipse.radiusY - ellipse.strokeWidth / 2, 2);
    return (innerPositionRatio <= 1) ? ellipse.fillColor : ellipse.strokeColor;
  }

  getColorPolygon(position: Point, primitive: SVGPrimitive): Color {
    let i: number;
    let j: number;
    let hasCrossed = false;
    const polygon = primitive as Polygon;
    for (i = 0, j = polygon.sidesNumber - 1; i < polygon.sidesNumber; j = i++) {
      if ((polygon.points[i].y > position.y) !== (polygon.points[j].y > position.y) &&
        (position.x < (polygon.points[j].x - polygon.points[i].x) * (position.y - polygon.points[i].y) /
          (polygon.points[j].y - polygon.points[i].y) + polygon.points[i].x)) {
        hasCrossed = !hasCrossed;
      }
    }
    return hasCrossed ? polygon.fillColor : polygon.strokeColor;
  }

  sendPrimaryToProperties(): void {
    this.eyeDropperPrimarySubject.next(this.command.newColor);
  }

  sendSecondaryToProperties(): void {
    this.eyeDropperSecondarySubject.next(this.command.newColor);
  }
}
