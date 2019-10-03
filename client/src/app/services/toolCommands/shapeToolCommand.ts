import { Shape } from '../svgPrimitives/shape/shape';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export abstract class ShapeToolCommand implements ToolCommand {
  shape: Shape;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType) {
    // TODO lors de la coordination des undo/redo
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean): void {
    this.shape.resize(corner1, corner2, isRegular);
  }

  abstract apply(): SVGPrimitive | null;
  abstract cancel(): void;
}
