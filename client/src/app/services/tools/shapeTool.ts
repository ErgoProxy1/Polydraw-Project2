import { Observable, Subject } from 'rxjs';
import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { CROSSHAIR_CURSOR, DEFAULT_STROKE_WIDTH, MouseEventType, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
  type = ToolType.None;
  protected fillColor: Color;
  protected strokeColor: Color;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
  strokeType: StrokeType = StrokeType.FullWithOutline;
  protected perimeter: Perimeter;
  protected command: ShapeToolCommand;
  private commandSubject: Subject<ShapeToolCommand> = new Subject<ShapeToolCommand>();
  protected isCreatingShape = false;
  protected initialPosition: Point;
  isRegular = false;

  constructor(fillColor: Color, strokeColor: Color) {
    super();
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.begin(position);
        break;
      case MouseEventType.MouseMove:
        this.update(position);
        break;
      case MouseEventType.MouseUpLeft:
        this.update(position);
        this.finish();
        break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.isCreatingShape ? [this.command.shape, this.perimeter] : [];
  }

  getCursor(): string {
    return CROSSHAIR_CURSOR;
  }

  protected begin(position: Point): void {
    this.initialPosition = position;
    this.perimeter = new Perimeter(position);
    this.isCreatingShape = true;
  }

  protected update(position: Point): void {
    if (this.isCreatingShape && this.command && this.perimeter) {
      this.perimeter.resize(this.initialPosition, position);
      this.command.resize(this.initialPosition, position, this.isRegular);
    }
  }

  protected finish(): void {
    if (this.isCreatingShape) {
      this.isCreatingShape = false;
      this.commandSubject.next(this.command);
    }
  }
}
