import { Path } from '../svgPrimitives/path/path';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { ToolCommand } from './toolCommand';

export abstract class DrawingToolCommand implements ToolCommand {
  path: Path;

  constructor(strokeColor: Color, strokeWidth: number) {
    // TODO lors de la coordination des undo/redo
  }

  abstract apply(): SVGPrimitive | null;
  abstract cancel(): void;
}
