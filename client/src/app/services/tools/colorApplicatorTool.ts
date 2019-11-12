import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ColorApplicatorToolCommand } from '../toolCommands/colorApplicatorCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { MouseEventType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class ColorApplicatorTool extends Tool {
  type = ToolType.ColorApplicator;
  private command: ColorApplicatorToolCommand;
  private commandSubject: Subject<ColorApplicatorToolCommand> = new Subject<ColorApplicatorToolCommand>();
  private primaryColor: Color;
  private secondaryColor: Color;

  constructor(primaryColor: Color, secondaryColor: Color) {
    super();
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    if (primitive && (eventType === MouseEventType.MouseClickLeft || eventType === MouseEventType.MouseClickRight)) {
      this.createCommand(eventType === MouseEventType.MouseClickLeft, primitive);
    }
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  private createCommand(isLeft: boolean, primitive: SVGPrimitive): void {
    const color: Color = isLeft ? Color.copyColor(this.primaryColor) : Color.copyColor(this.secondaryColor);
    this.command = new ColorApplicatorToolCommand(primitive, isLeft, color);
    this.commandSubject.next(this.command);
  }
}
