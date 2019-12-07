import { Polygon } from '../svgPrimitives/polygon/polygon';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ShapeTool } from './shapeTool';

export class PolygonTool extends ShapeTool {
  TYPE = ToolType.PolygonTool;
  numberOfSides = 3;
  isRegular = true;

  constructor(fillColor: Color, strokeColor: Color) {
    super(fillColor, strokeColor);
   }

   protected begin(position: Point): void {
     this.command = new ShapeToolCommand(new Polygon(this.fillColor, this.strokeColor, this.strokeWidth,
                                          this.strokeType, position, this.numberOfSides));
     super.begin(position);
   }

   protected update(position: Point): void {
     if (this.isCreatingShape) {
       super.update(position);
     }
   }
}
