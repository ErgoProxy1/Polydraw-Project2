import { Observable, Subject } from 'rxjs';
import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Shape } from '../svgPrimitives/shape/shape';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { MouseEventType, PrimitiveType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class EyeDropperTool extends Tool {
  type = ToolType.EyeDropper;

  eyeDropperPrimaryObservable: Observable<Color>;
  private eyeDropperPrimarySubject = new Subject<Color>();

  eyeDropperSecondaryObservable: Observable<Color>;
  private eyeDropperSecondarySubject = new Subject<Color>();

  constructor() {
    super();
    this.eyeDropperPrimaryObservable = this.eyeDropperPrimarySubject.asObservable();
    this.eyeDropperSecondaryObservable = this.eyeDropperSecondarySubject.asObservable();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    if (primitive && (eventType === MouseEventType.MouseDownLeft || eventType === MouseEventType.MouseDownRight)) {
      this.createCommand(eventType === MouseEventType.MouseDownLeft, position, primitive);
    }
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return new Observable();
  }

  private createCommand(isPrimary: boolean, position: Point, primitive: SVGPrimitive): void {
    const color: Color = Color.copyColor(this.determineFillOrStroke(position, primitive));
    isPrimary ? this.sendPrimaryToProperties(color) : this.sendSecondaryToProperties(color);
  }

  determineFillOrStroke(position: Point, primitive: SVGPrimitive): Color {
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
    } else if (primitive.type === PrimitiveType.Text) {
      return (primitive as TextPrimitive).textColor;
    } else if (primitive.type === PrimitiveType.Pencil || primitive.type === PrimitiveType.Paint || primitive.type === PrimitiveType.Pen) {
      return (primitive as Path).strokeColor;
    } else {
      return (primitive as Shape).fillColor;
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

  sendPrimaryToProperties(color: Color): void {
    this.eyeDropperPrimarySubject.next(color);
  }

  sendSecondaryToProperties(color: Color): void {
    this.eyeDropperSecondarySubject.next(color);
  }
}
