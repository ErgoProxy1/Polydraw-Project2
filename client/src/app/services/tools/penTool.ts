import { Pen } from '../svgPrimitives/pen/pen';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { DrawingToolCommand } from '../toolCommands/drawingToolCommand';
import { Color } from '../utils/color';
import { CURSOR_SPEED_FACTOR, DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH, DEFAULT_PEN_STROKE_WIDTH, MouseEventType,
  PEN_CURSOR_SPEED_INITIAL_POINT_RANK, PrimitiveType, SECOND_TO_MILI_SECOND, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingTool } from './drawingTool';

export class PenTool extends DrawingTool {
  TYPE = ToolType.Pen;
  minStrokeWidth: number;

  initialPosition: Point = new Point(0, 0);
  startTime: number;

  constructor(strokeColor: Color) {
    super(strokeColor);
    this.strokeWidth = DEFAULT_PEN_STROKE_WIDTH;
    this.minStrokeWidth = DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.begin(position);
        break;
      case MouseEventType.MouseMove:
          if (this.command !== undefined) {
            const len = (this.command.path as Pen).headPoints.length;
            if (len >= PEN_CURSOR_SPEED_INITIAL_POINT_RANK) {
              this.initialPosition = (this.command.path as Pen).headPoints[len - PEN_CURSOR_SPEED_INITIAL_POINT_RANK];
            } else {
              this.initialPosition = position;
            }
            this.startTime = Date.now();
            this.update(position);
            this.updateStrokeWidth(position);
          }
          break;
      case MouseEventType.MouseUpLeft:
        this.finish();
        break;
      case MouseEventType.MouseLeave:
          this.finish();
          break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  protected begin(position: Point): void {
    this.command = new DrawingToolCommand(this.strokeColor, this.strokeWidth, PrimitiveType.Pen);
    this.isCreatingPath = true;
  }

/**
 * Cette fonction permet de calculer et de mettre à jour
 * la taille du trait en fonction de la vitesse du curseur.
 * @param position La position courante du curseur.
 */
  updateStrokeWidth(position: Point): void {
    if (this.command && this.isCreatingPath) {
      const cursorSpeed = Math.sqrt( Math.pow(position.x - this.initialPosition.x, 2) +
                          Math.pow(position.y - this.initialPosition.y, 2)) /
                          ( 1 + (Date.now() - this.startTime) / SECOND_TO_MILI_SECOND);
      const newStrokeWidth = this.command.STROKE_WIDTH * (1 - cursorSpeed / CURSOR_SPEED_FACTOR);
      this.command.path.strokeWidth =  Math.max(this.minStrokeWidth,  newStrokeWidth );
      (this.command.path as Pen).addPath(position, this.command.path.strokeWidth);
    }
  }
}
