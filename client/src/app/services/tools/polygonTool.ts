import { PolygonCommand } from '../toolCommands/polygonCommand';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeTool } from './shapeTool';
import { Tool } from './tool';

export class PolygonTool extends ShapeTool implements Tool {

  type = ToolType.PolygonTool;
  numberOfSides = 3;
  constructor(fillColor: Color, strokeColor: Color) {
    super(fillColor, strokeColor);
   }

   protected begin(position: Point): void {
     this.command = new PolygonCommand(this.fillColor, this.strokeColor, this.strokeWidth,
      this.strokeType, position, this.numberOfSides);
     super.begin(position);
   }

   protected update(position: Point): void {
     if (this.isCreatingShape) {
       super.update(position, true);
     }
   }
}
